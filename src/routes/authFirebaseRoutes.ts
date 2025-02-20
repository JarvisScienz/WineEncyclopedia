import express from 'express';
import cors from 'cors';

import firebaseAuthController from '../controllers/firebaseAuthController.js'; // Assuming firebase-auth-controller.mjs uses ESM

const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:3000/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.post('/api/authentication/login', firebaseAuthController.loginUser);

router.post('/api/authentication/createUser', firebaseAuthController.registerUser); 

router.post('/api/authentication/logout', firebaseAuthController.logoutUser); // Assuming authController exists and uses ESM

export default router; // Use modern default export for clarity
