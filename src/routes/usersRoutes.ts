import express from 'express';
//import cors from 'cors';

import usersController from '../controllers/usersController.js';

const router = express.Router();

router.post('/api/v1/userInformation', usersController.getUserInformation);

router.post('/api/v1/saveReview', usersController.saveReview);


export default router;