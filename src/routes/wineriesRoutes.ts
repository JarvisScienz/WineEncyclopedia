import express from 'express';
//import cors from 'cors';

import wineriesController from '../controllers/wineriesController.js';

const router = express.Router();

router.post('/api/wineries', wineriesController.getWineries);

router.post('/api/wineriesList', wineriesController.getWineriesList);

router.post('/api/addWineries', wineriesController.addWineries);

export default router;