import express, { NextFunction, Response } from "express";
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

// const firebaseWinesService = require("./services/firebaseWinesService");
// const firebaseGrapesService = require("./services/firebaseGrapesService");
// const firebaseAuthService =  require("./services/firebaseAuthService");

import authFirebaseRoutes from './routes/auth-firebase.js';
import wineRoutes from './routes/wines.js';
//import grapesRoutes from './routes/grapes.js';

const secretKey = process.env.SECRET_KEY;

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});



const app = express();
const port = process.env.PORT || 3000;
      
const wines: any = [];
const filePath = 'wines.json';
const corsOptions = {
	origin: 'https://wineencyclopedia-fe.onrender.com', // Il dominio del frontend
	methods: ['GET', 'POST', 'PUT', 'DELETE'], // I metodi HTTP che vuoi consentire
	//credentials: true, // Se stai usando cookie o autenticazione
	optionsSuccessStatus: 200 // Alcuni browser vecchi hanno problemi con lo status 204
};

app.use(cors(corsOptions));
app.use(connectLiveReload());
app.use(bodyParser.json());
//app.use(express.static(process.cwd()+"/wine-encyclopedia-frontend/dist/wine-encyclopedia-frontend/"));


/*
 * API - AUTH
 */

app.use(authFirebaseRoutes);
app.use(wineRoutes);

// app.post('/api/authentication/createUser', (req: Request, res: Response) => {
// 	const email = req.body?.email;
// 	const password = req.body?.password;
// 	firebaseAuthService.createUser(email, password).then((uid: any) => {
// 	    if (uid) {
// 	    	res.json(uid);
// 	      } else {
// 	        // L'utente non è autenticato o le credenziali sono errate, gestisci l'errore
// 	    	  return false;
// 	      }
// 	    })
// 	    .catch((error : any) => {
// 	      console.error('Errore durante la creazione dell\'utente:', error);
// 	    });
// });


/*
 * API
 */

// app.post('/api/wine', verifyToken, (req: Request, res: Response) => {
//   const wine = req.body?.wine;  
//   //writeObjectToFile(wineTasting, filePath);
//   firebaseWinesService.addWine(wine)
// 	  .then((id: any) => {
// 		  res.json("Wine tasting sheet addedd. ID: " + id);
// 	  })
// 	  .catch((error : any) => {
// 	    console.error('Errore durante l\'esecuzione della query:', error);
// 	  });
// });

// app.post('/api/editWine', verifyToken, (req: Request, res: Response) => {
// 	const wineUpdated = req.body?.wine;
// //  editWine(wineUpdated);
// //  res.json("Wine updated. " + wineUpdated);
// 	firebaseWinesService.updateWine(wineUpdated)
// 	  .then((id: any) => {
// 		  res.json("Wine updated. " + id);
// 	  })
// 	  .catch((error : any) => {
// 	    console.error('Errore durante l\'esecuzione della query:', error);
// 	  });
// });

// app.get('/api/wineryList', verifyToken, (req: Request, res: Response) => {
// 	var wineryList = getWineryList();
// 	res.json(wineryList);
// });

// app.get('/api/grapes', verifyToken, (req: Request, res: Response) => {
// 	firebaseGrapesService.getGrapes().then((jsonData: any) => {
// 		  res.json(jsonData);
// 	  })
// 	  .catch((error : any) => {
// 	    console.error('Errore durante l\'esecuzione della query:', error);
// 	  });
// });

// app.get('/api/grapesName', verifyToken, (req: Request, res: Response) => {
// 	firebaseGrapesService.getGrapesName().then((jsonData: any) => {
// 		  res.json(jsonData);
// 	  })
// 	  .catch((error : any) => {
// 	    console.error('Errore durante l\'esecuzione della query:', error);
// 	  });
// });

// app.get('/', (req: Request, res: Response) => {
// 	  res.sendFile(process.cwd()+"/wine-encyclopedia-frontend/dist/wine-encyclopedia-frontend/index.html")
// 	});

app.listen(port, () => {
    console.log(`Wine-encyclopedia\\index.ts - Server listening on the port::${port}`);
});

/*
 * Functions
 */

// function verifyToken(req: Request, res: Response, next: NextFunction) {
//   const token = req.headers.get('Authorization');
  
//   if (!token) {
//     return res.status(401).json({ message: 'Token mancante. Accesso non autorizzato.' });
//   }

//   jwt.verify(token, secretKey, (err: any, decoded: any) => {
//     if (err) {
//       return res.status(403).json({ message: 'Token non valido. Accesso non autorizzato.' });
//     }

//     req.user = decoded;
//     next();
//   });
// }

// function getWinesByColor (color: String){
// 	var winesInFile = readFile(filePath);
// 	let filteredData = winesInFile.filter((obj: any) => obj.color.includes(color));
// 	return filteredData;
// }

// function getWinesByVintage (vintage){
// 	var winesInFile = readFile(filePath);
// 	let filteredData = winesInFile.filter((obj) => obj.vintage === vintage);
// 	return filteredData;
// }

function getWineryList(){
	//let jsonData = firebaseSerive.getWines();
	// let jsonData = JSON.parse(rawdata);

	// Ottieni un array di tutti i valori della chiave "winery"
	let wineryValues = wines.map((obj: any) => obj.winery);

	return wineryValues;
}

// function editWine (wine: any){
// 	var winesInFile = readFile(filePath);
// 	console.log("Wine id: " + wine.id);
// 	const index = winesInFile.findIndex((obj: any) => obj.id === wine.id);

//     if (index === -1) {
//       console.error('Nessun oggetto trovato con l\'ID specificato.');
//       return;
//     }

//     // Aggiorna l'oggetto trovato con i dati aggiornati
//     jsonArray[index] = wine;

//     // Converti l'array JSON aggiornato in stringa
//     const updatedData = JSON.stringify(jsonArray, null, 2);
// 	writeObjectToFile(updatedData, filePath);
// 	res.json("Wine tasting sheet updated");
// }