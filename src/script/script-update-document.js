import { getFirestore, collection, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore";

const db = getFirestore();

async function updateWineTastedCollection() {
  try {
    const wineTastedRef = collection(db, "wine-tasted");
    const snapshot = await getDocs(wineTastedRef);

    if (snapshot.empty) {
      console.log('Nessun documento trovato nella collezione wine-tasted.');
      return;
    }

    const createdAtValue = '2024-04-14T16:18:37.369Z';

    snapshot.forEach(async document => {
      const data = document.data();
      if (data.createdAt instanceof Date || data.createdAt instanceof Timestamp) {
        const docRef = doc(db, 'wine-tasted', document.id);
        const wineData = { ...data, createdAt: createdAtValue };
        await updateDoc(docRef, wineData);
      }
    });    
    console.log('Tutti i documenti sono stati aggiornati con successo.');
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dei documenti:', error);
  }
}

export default updateWineTastedCollection;