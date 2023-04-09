//var nmap = require('node-nmap');
var nmap = require('node-nmap-vulners');
nmap.nmapLocation = "nmap";

var hosts = [];

// Define la función que realiza el escaneo
const scan = () => {

	console.log("================ NEW SCAN ================");
	console.log(new Date());
	//var largeScan = new nmap.OsAndPortScan("192.168.1.1-255");
	var largeScan = new nmap.NmapScan("192.168.1.1-255");

	// Retorna una promesa que se resuelve con el resultado del escaneo
	return new Promise((resolve, reject) => {

		largeScan.on('complete', function (data) {
			//console.log(data);
			console.log("================ RESULTS ================");
			console.log(new Date());
			console.log("Total scan time: " + largeScan.scanTime / 10 / 60 + " seconds");

			if (hosts.length === 0) {
				hosts = data;
				console.log("================ HOSTS ================");
				//printSimpleResults(hosts);
				resolve(data);
			} else {
				//var newHosts = getNewHosts(hosts, data);
				//var result = updateObjects(hosts, data);
				var result = compareHosts(hosts, data);
				var newHosts = result[0];
				var updatedHosts = result[1];
				//console.log(result);

				if (newHosts.length > 0) {
					console.log("================ NEW HOSTS ================");
					console.log(newHosts);
				}

				if (updatedHosts.length > 0) {
					console.log("================ UPDATES ================");
					console.log(updatedHosts);
					//console.log("length modifiedObjects: " + result.length);
					//console.log("length data: " + data.length);
				}
				
				hosts = mergeHostsArray(hosts,data);
				resolve(hosts);
			}
		});

		largeScan.on('error', function (error) {
			console.log(error);
			reject(error);
		});

		largeScan.on('pause', function (error) {
			console.log('pause:' + error);
		});

		largeScan.startScan();

	});
};



function compareHosts(originalHosts, newHosts) {
	const newHostsArr = [];
	const changedHostsArr = [];

	// Verificar si hay nuevos hosts en el segundo array
	newHosts.forEach((newHost) => {
		const found = originalHosts.find(
			(originalHost) => originalHost.ip === newHost.ip && originalHost.mac === newHost.mac
		);
		if (!found) {
			newHostsArr.push(newHost);
		}
	});

	// Verificar si hay cambios en la ip y mac de los hosts
	originalHosts.forEach((originalHost) => {
		const found = newHosts.find(
			(newHost) => originalHost.ip === newHost.ip && originalHost.mac === newHost.mac
		);
		if (found) {
			if (originalHost.ip !== found.ip || originalHost.mac !== found.mac) {
				changedHostsArr.push(found);
			}
		}
	});

	// Verificar si hay cambios en la propiedad openPorts
	newHosts.forEach((newHost) => {
		const found = originalHosts.find(
			(originalHost) => originalHost.ip === newHost.ip && originalHost.mac === newHost.mac
		);
		if (found) {
			if (JSON.stringify(found.openPorts) !== JSON.stringify(newHost.openPorts)) {
				changedHostsArr.push(newHost);
			}
		}
	});

	// Devolver un array que contenga newHosts y changedHosts
	return [newHostsArr, changedHostsArr];
}

function mergeHostsArray(originalHosts, newHosts) {
  // Unir los dos arrays
  const mergedHosts = originalHosts.concat(newHosts);
  
  // Eliminar duplicados basados en la ip y la mac del host
  const uniqueHosts = Array.from(new Set(mergedHosts.map(JSON.stringify))).map(JSON.parse);

  // Devolver el array unificado sin duplicados
  return uniqueHosts;
}


function getNewHosts(originalArray, newArray) {
	return originalArray.filter((originalObj) => {
		const match = newArray.find((newObj) => newObj.ip === originalObj.ip);
		return !match;
	});
}

function updateObjects(originalArray, newArray) {

	const modifiedObjects = originalArray.filter((originalObj, index) => {

		const newObj = newArray[index];

		if (!newObj) {
			return false;
		}

		const modifiedProps = Object.entries(newObj).filter(([key, value]) => {
			if (originalObj[key] !== value) {
				return true;
			}
			return false;
		});

		if (modifiedProps.length > 0) {
			const modifiedObj = {
				...originalObj,
				modifiedProps: modifiedProps
			};
			console.log("modifiedProps:" + modifiedProps);
			return true;
		}

		return false;


	}).map((obj) => ({
		...obj
	}));

	return modifiedObjects;
}


function printSimpleResults(hostList) {
	hostList.forEach(host => {
		console.log("IP: " + host.ip);
		console.log("Open ports: " + host?.openPorts?.length || "0");
		console.log("Info: " + host.osNmap + " | " + host.vendor);
		console.log("================================");
	});
}

module.exports = scan;