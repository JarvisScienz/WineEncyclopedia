import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Configura Firebase
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function moveCollection() {
  const oldCollectionRef = collection(db, "wines");
  const newCollectionRef = collection(db, "wine-tasted");

  try {
    const snapshot = await getDocs(oldCollectionRef);
    
    for (const docSnap of snapshot.docs) {
      const docData = docSnap.data();
      
      // Copia il documento nella nuova collezione
      //await setDoc(doc(newCollectionRef, docSnap.id), docData);
      await setDoc(doc(newCollectionRef), docData);

      // Cancella il documento dalla vecchia collezione
      //await deleteDoc(doc(oldCollectionRef, docSnap.id));
      
      console.log(`Documento ${docSnap.id} spostato con successo.`);
    }

    console.log("Tutti i documenti sono stati spostati con successo!");
  } catch (error) {
    console.error("Errore durante lo spostamento dei documenti:", error);
  }
}

moveCollection();
