# Bulk Domain Availability Checker

## Description

This script checks the availability of domain names by resolving DNS records and performing WHOIS lookups. It generates possible domain names based on a wildcard pattern and checks their availability.

## Features

- Generates domain names by replacing `*` with random letters.
- Checks DNS resolution to see if a domain is already in use.
- Uses WHOIS lookup to verify domain availability.
- Limits concurrent domain checks to prevent excessive requests.
- Saves available domains to `domains.txt`.

## Configuration

Create a `config.json` file with the following structure:

```json
{
  "domain": "aman***.com"
}
```

Replace `***` with the wildcard position where letters should be replaced.

## Usage

1. Run the script:
   ```sh
   node app.js
   ```
2. The script will generate domain names, check their availability, and save the available ones to `domains.txt`.
3. Progress updates will be displayed in the terminal.

## Output

- Available domains will be saved in `domains.txt`.
- The console will show the number of domains checked and found.

## Notes

- WHOIS responses may vary by registrar, so some unavailable domains might not be detected correctly.
- DNS resolution does not guarantee availability; domains might be parked or reserved.
- Increase the `p-limit` value if you want faster processing, but be mindful of rate limits.

## License

This script is open-source and available for modification and distribution.

