import express from 'express';
//import cors from 'cors';

import myCellarController from '../controllers/myCellarController.js';

const router = express.Router();

router.post('/api/myCellarWines', myCellarController.getMyCellarWines);

export default router;