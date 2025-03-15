const fs = require("fs");
const path = require("path");
const pLimit = require("p-limit");
const dns = require("dns").promises;

const sapl = "abcdefghijklmnopqrstuvwxyz";

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

const config = require("./config.json");
const filePath = path.join(__dirname, "domains.txt");
const writer = fs.createWriteStream(filePath);

async function main() {
  const baseDomain = config.domain; 
  const domains = generateDomains(baseDomain);

  let foundDomainCounter = 0;
  const limit = pLimit(5); 

  const tasks = domains.map((domain, idx) =>
    limit(async () => {
      const unknown = await isDomainUnknown(domain);
      if (unknown) {
        foundDomainCounter++;
        writer.write(domain + "\n");
      }
      // Log progress without clearing the console
      console.clear();
      console.log(`Found: ${foundDomainCounter} - Checked: ${idx + 1}/${domains.length} - Domain: ${domain}`);
    })
  );

  await Promise.all(tasks);
  writer.end();
}

main();