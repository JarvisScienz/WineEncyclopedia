import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  sendPasswordResetEmail
}  from 'firebase/auth';
import { 
  collection,
  getFirestore,
  getDocs,
  getDoc,
  doc,
  where,
  query,
  addDoc,
  setDoc,
  updateDoc
}  from 'firebase/firestore';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

//import firebaseWinesService from '../services/firebaseWinesService.js';
import app from '../config/firebase.js';

dotenv.config();
const secretKey = process.env.SECRET_KEY as string;
const db = getFirestore();
const auth = getAuth(app.app);

class GrapesController {
  async getGrapes(req: any, res: any) {
    /*const { uid } = req.body;
    if (!uid ) {
      return res.status(422).json({
        uid: "UID is required"
      });
    }*/
    try {
      const grapesCollection = collection(db, "grapes");
      const snapshot = await getDocs(grapesCollection);
        const data: any = [];
  
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });
  
        res.status(200).json(data);
      } catch (error) {
        console.error('Errore durante l\'esecuzione delle query:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getGrapesName(req: any, res: any) {
    try {
      const grapesCollection = collection(db, "grapes");
      const snapshot = await getDocs(grapesCollection);
        const data: any = [];
  
        snapshot.forEach((doc) => {
          data.push(doc.data().name);
        });
  
        res.status(200).json(data);
      } catch (error) {
        console.error('Errore durante l\'esecuzione delle query:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async addWine(req: any, res: any) {
    const { grape } = req.body;
    try {
      const grapeRef = doc(db, "wines", grape.name);
      await setDoc(grapeRef, {
          name: grape.name
      });
      res.status(200).json({ id: grapeRef.id });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

}

export default new GrapesController();
