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

class WinesController {
  async getWines(req: any, res: any) {
    const { uid } = req.body;
    if (!uid ) {
      return res.status(422).json({
        uid: "UID is required"
      });
    }
    try {
      const winesCollection = collection(db, "wines");
      const snapshot = await getDocs(winesCollection);
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

  async getWinesByColor(req: any, res: any) {
    const { color } = req.body;
    var color1, color2, color3, color4;
    switch  (color){
    case "red":
      color1 = "red_purplish";
      color2 = "red_ruby";
      color3 = "red_garnet";
      color4 = "red_orange";
      break;
    case "yellow":
      color1 = "yellow_greenish";
      color2 = "yellow_straw";
      color3 = "yellow_golden";
      color4 = "yellow_amber";
      break;
    case "rose":
      color1 = "rose_soft";
      color2 = "rose_coppery";
      color3 = "rose_cherry";
      color4 = "rose_claret";
      break;
    }
    try {
      const colorsArray = [color1, color2, color3, color4];
      const winesColorQuery = query(collection(db, 'wines'), where('color', 'in', colorsArray));
		  const snapshot = await getDocs(winesColorQuery);
      const data: any = [];
  
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
  
        res.status(200).json(data);
      } catch (error) {
        console.error('Errore durante l\'esecuzione dei query:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async winesByWinery(req: any, res: any) {
    const { winery } = req.body;
    try {
      const winesWineryQuery = query(collection(db, 'wines'), where('winery', '==', winery));
      const snapshot = await getDocs(winesWineryQuery);
      const data: any = [];
      
      snapshot.forEach(doc => {
        data.push(doc.data());
      });
      res.status(200).json(data);
    } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async addWine(req: any, res: any) {
    const { wine } = req.body;
    try {
      const newDocRef = await addDoc(collection(db, 'wines'), wine);
      res.status(200).json({ id: newDocRef.id });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async editWine(req: any, res: any) {
    const { wine } = req.body;
    try {
      const docRef = doc(db, 'wines', wine.id);
      await updateDoc(docRef, wine);  
      res.status(200).json({ id: wine.id });
    } catch (error) { 
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async wineryList(req: any, res: any) {
  }

}

export default new WinesController();
