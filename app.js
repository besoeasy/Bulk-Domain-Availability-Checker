const fs = require("fs");
const path = require("path");
const dns = require("dns").promises;
const readline = require("readline");

const sapl = "abcdefghijklmnopqrstuvwxyz";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to check if a domain is unknown (unreachable)
const isDomainUnknown = async (domain) => {
  try {
    await dns.resolve(domain);
    return false; // Domain is reachable
  } catch (error) {
    return true; // Domain is unknown/unreachable
  }
};

// Function to generate all possible domain names by replacing '*' with letters
const generateDomains = (baseDomain) => {
  const chars = sapl.split("").sort(() => Math.random() - 0.5);
  const domains = [];

  const generateWithWildcard = (domain, index) => {
    if (index === domain.length) {
      domains.push(domain);
      return;
    }
    if (domain[index] === "*") {
      for (let char of chars) {
        generateWithWildcard(domain.slice(0, index) + char + domain.slice(index + 1), index + 1);
      }
    } else {
      generateWithWildcard(domain, index + 1);
    }
  };

  generateWithWildcard(baseDomain, 0);
  return domains;
};

const filePath = path.join(__dirname, "domains.txt");
const writer = fs.createWriteStream(filePath, { flags: "a" }); // Append mode

async function main(baseDomain) {
  const domains = generateDomains(baseDomain);
  let foundDomainCounter = 0;
  
  for (let i = 0; i < domains.length; i++) {
    const domain = domains[i];
    const unknown = await isDomainUnknown(domain);
    if (unknown) {
      foundDomainCounter++;
      writer.write(domain + "\n");
    }
    console.clear();
    console.log(`Found: ${foundDomainCounter} - Checked: ${i + 1}/${domains.length} - Domain: ${domain}`);
  }

  writer.end();
  rl.close();
}

rl.question("Enter base domain: ", (baseDomain) => {
  main(baseDomain);
});
