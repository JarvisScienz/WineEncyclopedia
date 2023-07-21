const fs = require('fs');

function readFile (filePath) {
	let rawdata = fs.readFileSync(filePath);
	let jsonData = JSON.parse(rawdata);
	return jsonData;
// fs.readFile(filePath, 'utf8', (err, data) => {
// if (err) {
// console.error('Errore nella lettura del file:', err);
// return;
// }
// console.log("Data: " + data);
// // Parsa il contenuto JSON
// let jsonData = JSON.parse(data);
// console.log("JSON Data: " + jsonData);
// // Verifica se l'array esiste nel JSON
// return data;
// });
}

function writeObjectToFile(obj, filePath) {
	  // Converti l'oggetto in JSON
	  var fileContent = readFile(filePath);
	  fileContent.push(obj);
	  const jsonData = JSON.stringify(fileContent, null, 2);
	  // Scrivi il JSON nel file
	  fs.writeFile(filePath, jsonData, 'utf8', (err) => {
	    if (err) {
	      console.error('Errore nella scrittura del file:', err);
	      return;
	    }

	    console.log('Il file JSON è stato scritto correttamente.');
	  });
	}


module.exports = { readFile, writeObjectToFile};