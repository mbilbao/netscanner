require('dotenv').config();
const fs = require('fs');
const moment = require('moment');

const scan = require('./scan');
const vulnerabilities = require('./vulnerabilities');

const INTERVAL_MINUTES = process.env.INTERVAL_MINUTES;
const OUTPUT_PATH = './output/';

// Crea la carpeta para los resultados si no existe
if (!fs.existsSync(OUTPUT_PATH)) {
  fs.mkdirSync(OUTPUT_PATH);
}

// Función que se ejecuta cada INTERVAL_MINUTES minutos
const executeScan = () => {
  const now = moment().format('YYYY-MM-DD_HH-mm-ss');
  const outputPath = OUTPUT_PATH + now + '.txt';

  scan()
    .then((result) => {
      // Escribe el resultado en un archivo
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
      console.log('Scan realizado correctamente');
    })
    .catch((error) => {
      console.error('Error al realizar el scan', error);
    });
};

// Ejecuta la primera vez
executeScan();
vulnerabilities();

// Ejecuta cada INTERVAL_MINUTES minutos
setInterval(executeScan, INTERVAL_MINUTES * 60 * 1000);
