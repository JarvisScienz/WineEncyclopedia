import express from 'express';
//import cors from 'cors';

import scriptController from '../controllers/scriptController.js';

const router = express.Router();

router.post('/api/v1/updateWinesTasted', scriptController.updateWinesTasted);

export default router;