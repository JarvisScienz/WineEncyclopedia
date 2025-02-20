import express, { NextFunction, Response } from "express";
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit'

// const firebaseWinesService = require("./services/firebaseWinesService");
// const firebaseGrapesService = require("./services/firebaseGrapesService");
// const firebaseAuthService =  require("./services/firebaseAuthService");

import authFirebaseRoutes from './routes/authFirebaseRoutes.js';
import wineRoutes from './routes/winesRoutes.js';
import grapesRoutes from './routes/grapesRoutes.js';
import myCellarRoutes from './routes/myCellarRoutes.js';
import wineTastedRoutes from './routes/wineTastedRoutes.js';
import wineriesRoutes from './routes/wineriesRoutes.js';

const secretKey = process.env.SECRET_KEY;

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})



const app = express();
const port = process.env.PORT || 3000;
      
const wines: any = [];
const filePath = 'wines.json';
const corsOptions = {
	origin: ['https://wineencyclopedia-fe.onrender.com', 'https://wineencyclopedia-245f5.web.app'], 
	methods: ['GET', 'POST', 'PUT', 'DELETE'], // I metodi HTTP che vuoi consentire
	credentials: true, // Se stai usando cookie o autenticazione
	optionsSuccessStatus: 200 // Alcuni browser vecchi hanno problemi con lo status 204
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(connectLiveReload());
app.use(bodyParser.json());
app.use(limiter);
//app.use(express.static(process.cwd()+"/wine-encyclopedia-frontend/dist/wine-encyclopedia-frontend/"));


/*
 * API
 */

app.use(authFirebaseRoutes);
app.use(wineRoutes);
app.use(grapesRoutes);
app.use(myCellarRoutes);
app.use(wineTastedRoutes);
app.use(wineriesRoutes);

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