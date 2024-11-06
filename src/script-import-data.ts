import * as admin from 'firebase-admin';
const csv = require('csv-parser');
import * as fs from 'fs';

// Inizializza Firebase
const serviceAccount = require('../wineencyclopedia-245f5-firebase-adminsdk-5bhjd-b1ac58c49c.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const collectionName = 'wines'; // Nome della tua collection in Firebase

// Funzione per importare i dati dal CSV
const importCsvToFirebase = async () => {
  return new Promise<void>((resolve, reject) => {
    let count = 0;
    fs.createReadStream('C:\\Users\\davide.scilletta\\Downloads\\Vini - Foglio1 - Copia.tsv')
      .pipe(csv({ separator: '\t', headers: false}))
      .on('data', async (row: any) => {
        try {
          count++;
          console.log(`Riga ${count}:`, row[0]);
          //await db.collection(collectionName).add(row);
        } catch (error) {
          console.error('Errore nell\'aggiunta del dato:', error);
        }
      })
      .on('end', () => {
        console.log(`Importazione completata. Totale righe importate: ${count}`);
        resolve();
      })
      .on('error', (error: any) => {
        console.error('Errore durante la lettura del CSV:', error);
        reject(error);
      });
  });
};

// Esecuzione dello script
importCsvToFirebase().catch((error) => {
  console.error('Errore nello script di importazione:', error);
});
