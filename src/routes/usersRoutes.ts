import express from 'express';
//import cors from 'cors';

import usersController from '../controllers/usersController.js';

const router = express.Router();

router.post('/api/v1/userInformation', usersController.getUserInformation);


export default router;