const axios = require('axios');
const fs = require('fs');
const path = require('path');

const directoryToWatch = './output';
// Define la función que realiza el escaneo
const vulnerabilities = () => {

	fs.watch(directoryToWatch, (eventType, filename) => {
		// Solo nos interesan los eventos 'rename', que ocurren cuando se crea un nuevo archivo
		if (eventType === 'rename') {
			const filePath = path.join(directoryToWatch, filename);
			console.log(`Se ha detectado un nuevo archivo: ${filePath}`);

			// Ejecutar la función X con el nombre del nuevo archivo como parámetro
			readfile(filePath);
		}
	});
}


function readfile(fileName) {
	// Código para procesar el nuevo archivo
	console.log(`Procesando el archivo ${fileName}...`);
	fs.readFile(fileName, 'utf8', (err, data) => {
		
		if (err) {
			console.error(`Error reading file ${file}: ${err}`);
			return;
		}

		const scanResults = JSON.parse(data);

		if (!scanResults.length === 0) {
			console.error(`No data in file ${file}`);
			return;
		}

		scanResults.forEach(host => {
			console.log(`Scanning ${host.ip} for vulnerabilities`);
			//vulnerabilityChecker(host);
		});
		
	})

}


async function vulnerabilityChecker(host) {
  const results = [];

    const os = host.osNmap;

    for (let j = 0; j < host.openPorts?.length; j++) {
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

  return results;
}


module.exports = vulnerabilities;