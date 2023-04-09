const axios = require('axios');
const fs = require('fs');
const nmap = require('node-nmap');
const vulners = require('nmap-vulners');

function scanResults() {
  fs.readdir('output', (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return;
    }

    files.forEach(file => {
      fs.readFile(`results/${file}`, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading file ${file}: ${err}`);
          return;
        }

        const scanResults = JSON.parse(data);

        if (!scanResults.host) {
          console.error(`Invalid data in file ${file}`);
          return;
        }

        const host = scanResults.host[0];
        console.log(`Scanning ${host.address} for vulnerabilities`);

        const scan = new nmap.NmapScan(host.address);
        scan.addFlags(['-sV', '-oX', '-']); // '-sV' para detección de versiones, '-oX -' para formato XML
        scan.on('complete', (data) => {
          console.log(`Scan of ${host.address} complete:`, data);
          const vulnerabilities = vulners.getVulnerabilities(data);
          if (vulnerabilities.length > 0) {
            console.log(`Found vulnerabilities on ${host.address}:`);
            vulnerabilities.forEach(vuln => {
              console.log(`  - ${vuln.id}: ${vuln.title}`);
            });
          } else {
            console.log(`No vulnerabilities found on ${host.address}`);
          }
        });
        scan.on('error', (error) => {
          console.error(`Error scanning ${host.address}:`, error);
        });
        scan.startScan();
      });
    });
  });
}





function findVulnerabilities(file, vulnerabilityChecker) {
  const data = fs.readFileSync(file);
  const hosts = JSON.parse(data);
  
  const hostsWithVulnerabilities = hosts.map((host) => {
    const vulnerabilities = vulnerabilityChecker(host);
    return { host, vulnerabilities };
  });
  
  return hostsWithVulnerabilities;
}



async function vulnerabilityChecker(hosts) {
  const results = [];

  for (let i = 0; i < hosts.length; i++) {
    const host = hosts[i];
    const os = host.osNmap;

    for (let j = 0; j < host.openPorts.length; j++) {
      const port = host.openPorts[j];
      const portNum = port.port;
      const protocol = port.protocol;

      const url = `https://cve.circl.lu/api/search/${os}/${portNum}/${protocol}`;

      try {
        const response = await axios.get(url);
        const cveData = response.data;
        if (cveData.length > 0) {
          const vulns = cveData.map((cve) => ({
            cveId: cve.id,
            summary: cve.summary,
            published: cve.published,
            modified: cve.modified,
            score: cve.cvss ? cve.cvss : 'N/A',
          }));

          results.push({
            host: host.ip,
            port: portNum,
            protocol: protocol,
            vulnerabilities: vulns,
          });
        }
      } catch (error) {
        console.error(`Error fetching data for ${host.ip}:${portNum}/${protocol}: ${error.message}`);
      }
    }
  }

  return results;
}



scanResults(); // ejecutar el proceso por primera vez

setInterval(() => {
  console.log(`Starting new scan at ${new Date().toLocaleString()}`);
  scanResults();
}, 60 * 60 * 1000); // repetir cada hora (en milisegundos)
