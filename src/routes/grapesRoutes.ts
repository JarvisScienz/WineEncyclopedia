import express from 'express';
//import cors from 'cors';

import grapesController from '../controllers/grapesController.js';

const router = express.Router();

// const corsOptions = {
//   origin: 'http://localhost:3000/',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

router.get('/api/grapes',  /*verifyToken,*/ grapesController.getGrapes);

router.get('/api/grapesName', grapesController.getGrapesName);

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

export default router; // Use modern default export for clarity
