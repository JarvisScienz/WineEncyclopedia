import express from 'express';
//import cors from 'cors';

import wineTastedController from '../controllers/wineTastedController.js';

const router = express.Router();

router.post('/api/winesTasted',  /*verifyToken,*/ wineTastedController.getWinesTasted);

router.post('/api/winesByColor', wineTastedController.getWinesByColor); 

router.post('/api/addWineTasted', wineTastedController.addWineTasted);

router.post('/api/editWineTasted', wineTastedController.editWineTasted);

router.post('/api/wineTastedInYears', wineTastedController.getWineTastedInYears);

export default router;