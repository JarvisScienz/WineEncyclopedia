import express from 'express';
//import cors from 'cors';

import winesController from '../controllers/winesController.js';
import { verifyToken } from '../services/jwtService.js';

const router = express.Router();

// const corsOptions = {
//   origin: 'http://localhost:3000/',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

router.post('/api/wines',  verifyToken, winesController.getWines);

router.post('/api/winesByWinery', winesController.winesByWinery);

router.post('/api/getSimilarWines', winesController.getSimilarWines);

router.post('/api/editWine', winesController.editWine);

router.post('/api/addWine', winesController.addWine);

router.post('/api/addWines', winesController.addWines);

export default router;
