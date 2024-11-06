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
import grapesRoutes from './routes/grapes.js';

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
 * API
 */

app.use(authFirebaseRoutes);
app.use(wineRoutes);
app.use(grapesRoutes);


/*
 * API
 */

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