const express = require('express');
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const firebaseWinesService = require("./services/firebaseWinesService");
const firebaseGrapesService = require("./services/firebaseGrapesService");
const firebaseAuthService =  require("./services/firebaseAuthService");

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});



const app = express(),
      bodyParser = require("body-parser");
      port = 3000;
      
const wines = [];
const filePath = 'wines.json';

app.use(connectLiveReload());
app.use(bodyParser.json());
app.use(express.static(process.cwd()+"/wine-encyclopedia-frontend/dist/wine-encyclopedia-frontend/"));

/*
 * API - AUTH
 */

app.post('/api/authentication/login', (req, res) => {
	//console.log("REQ: " + req.body);
	const email = req.body.email;
	const password = req.body.password;
	firebaseAuthService.verifyUserAuth(email, password).then(uid => {
	    if (uid) {
	        // L'utente è autenticato, puoi eseguire le operazioni necessarie
	    	console.log("Connesso: " + uid);
	    	res.json(uid);
	      } else {
	        // L'utente non è autenticato o le credenziali sono errate, gestisci l'errore
	    	  console.log("Utente non autenticato");
	    	  return false;
	      }
	    })
	    .catch(error => {
	      console.error('Errore durante la verifica dell\'autenticazione:', error);
	    });
});

app.post('/api/authentication/logout', (req, res) => {
	console.log("API Logout: " + req);
	const email = req.body.email;
	firebaseAuthService.logout(email).then(uid => {
	    if (uid) {
	    	res.json(uid);
	      } else {
	    	  res.json(null);
	      }
	    })
	    .catch(error => {
	      console.error('Errore durante la verifica dell\'autenticazione:', error);
	    });
});

app.post('/api/authentication/createUser', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	firebaseAuthService.createUser(email, password).then(uid => {
	    if (uid) {
	    	res.json(uid);
	      } else {
	        // L'utente non è autenticato o le credenziali sono errate, gestisci l'errore
	    	  return false;
	      }
	    })
	    .catch(error => {
	      console.error('Errore durante la creazione dell\'utente:', error);
	    });
});


/*
 * API
 */
app.get('/api/wines', (req, res) => {
	// var winesInFile = readFile(filePath);
	// res.json(winesInFile);
	firebaseWinesService.getWines().then((jsonData) => {
		//wines = jsonData;
		  res.json(jsonData);
	  })
	  .catch((error) => {
	    console.error('Errore durante l\'esecuzione della query:', error);
	  });
});

app.post('/api/winesByColor', (req, res) => {
	const color = req.body.color;
	firebaseWinesService.getWinesByColor(color).then((jsonData) => {
		//wines = jsonData;
		  res.json(jsonData);
	  })
	  .catch((error) => {
	    console.error('Errore durante l\'esecuzione della query:', error);
	  });
  
//  var winesInFile = getWinesByColor(color);
//  res.json(winesInFile);
});

app.post('/api/winesByWinery', (req, res) => {
	const winery = req.body.winery;
	firebaseWinesService.getWinesByWinery(winery).then((jsonData) => {
		  res.json(jsonData);
	  })
	  .catch((error) => {
	    console.error('Errore durante l\'esecuzione della query:', error);
	  });
});

app.post('/api/wine', (req, res) => {
  const wine = req.body.wine;  
  //writeObjectToFile(wineTasting, filePath);
  firebaseWinesService.addWine(wine)
	  .then((id) => {
		  res.json("Wine tasting sheet addedd. ID: " + id);
	  })
	  .catch((error) => {
	    console.error('Errore durante l\'esecuzione della query:', error);
	  });
});

app.post('/api/editWine', (req, res) => {
	const wineUpdated = req.body.wine;
//  editWine(wineUpdated);
//  res.json("Wine updated. " + wineUpdated);
	firebaseWinesService.updateWine(wineUpdated)
	  .then((id) => {
		  res.json("Wine updated. " + id);
	  })
	  .catch((error) => {
	    console.error('Errore durante l\'esecuzione della query:', error);
	  });
});

app.get('/api/wineryList', (req, res) => {
	var wineryList = getWineryList();
	res.json(wineryList);
});

app.get('/api/grapes', (req, res) => {
	firebaseGrapesService.getGrapes().then((jsonData) => {
		  res.json(jsonData);
	  })
	  .catch((error) => {
	    console.error('Errore durante l\'esecuzione della query:', error);
	  });
});

app.get('/api/grapesName', (req, res) => {
	firebaseGrapesService.getGrapesName().then((jsonData) => {
		  res.json(jsonData);
	  })
	  .catch((error) => {
	    console.error('Errore durante l\'esecuzione della query:', error);
	  });
});

app.get('/', (req,res) => {
	  res.sendFile(process.cwd()+"/wine-encyclopedia-frontend/dist/wine-encyclopedia-frontend/index.html")
	});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

/*
 * Functions
 */
function getWinesByColor (color){
	var winesInFile = readFile(filePath);
	let filteredData = winesInFile.filter((obj) => obj.color.includes(color));
	return filteredData;
}

function getWinesByVintage (vintage){
	var winesInFile = readFile(filePath);
	let filteredData = winesInFile.filter((obj) => obj.vintage === vintage);
	return filteredData;
}

function getWineryList(){
	//let jsonData = firebaseSerive.getWines();
	// let jsonData = JSON.parse(rawdata);

	// Ottieni un array di tutti i valori della chiave "winery"
	let wineryValues = wines.map((obj) => obj.winery);

	return wineryValues;
}

function editWine (wine){
	var winesInFile = readFile(filePath);
	console.log("Wine id: " + wine.id);
	const index = winesInFile.findIndex((obj) => obj.id === wine.id);

    if (index === -1) {
      console.error('Nessun oggetto trovato con l\'ID specificato.');
      return;
    }

    // Aggiorna l'oggetto trovato con i dati aggiornati
    jsonArray[index] = wine;

    // Converti l'array JSON aggiornato in stringa
    const updatedData = JSON.stringify(jsonArray, null, 2);
	writeObjectToFile(updatedData, filePath);
	res.json("Wine tasting sheet updated");
}