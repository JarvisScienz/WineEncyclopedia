import 'dotenv/config';
import firebase from 'firebase/compat/app';
import admin from 'firebase-admin';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';

import firebaseAccountCredentials  from '../../wineencyclopedia-245f5-firebase-adminsdk-5bhjd-b1ac58c49c.json' assert { type: "json" };
//const firebaseAccountCredentials = require('../../wineencyclopedia-245f5-firebase-adminsdk-5bhjd-b1ac58c49c.json');

const serviceAccount = firebaseAccountCredentials as admin.ServiceAccount

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const getUserRecord = (uid: string) => admin.auth().getUser(uid)


const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

// Initialize Firebase


const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase Auth
//const auth = getAuth(app);

//export default { auth };
export default {
  app,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  admin,
  getUserRecord
};
