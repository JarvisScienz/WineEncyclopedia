import * as admin from 'firebase-admin';
const csv = require('csv-parser');
import * as fs from 'fs';

// Inizializza Firebase
const serviceAccount = require('../wineencyclopedia-245f5-firebase-adminsdk-5bhjd-b1ac58c49c.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true })
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
          let wineData: any = {};
          wineData.name = row[0];
          wineData.winery = row[1];
          //let color = row[3];
          wineData.grapeVariety = row[4];
          wineData.vintage = row[5];
          wineData.color = getColor(row[7]?.split(' ')[0] || "", row[7]?.split(' ')[1] || "");
          wineData.colorDensity = row[7]?.split(' ')[2] || "";
          wineData.limpidity = row[7]?.split(' ')[3] || "";
          wineData.consistency = row[7]?.split(' ')[4] || "";
          wineData.effervescenceBubbleGrain = row[7]?.split(' ')[5] || "";
          wineData.effervescenceBubbleNumber = row[7]?.split(' ')[6] || "";
          wineData.effervescenceBubblePersistence = row[7]?.split(' ')[7] || "";
          wineData.olfactoryIntensity = row[8]?.split(' ')[0] || "";
          wineData.olfactoryComplexity = row[8]?.split(' ')[1] || "";
          wineData.olfactoryQuality = row[8] || "";
          wineData.olfactoryDescription = row[8] || "";
          wineData.sugars = row[9]?.split(' ')[0] || "";
          wineData.alcohols = row[9]?.split(' ')[1] || "";
          wineData.polyalcohols = row[9]?.split(' ')[2] || "";
          wineData.acids = row[10]?.split(' ')[0] || "";
          wineData.tanninsQuality = row[10]?.split(' ')[1] || "";
          wineData.tanninsQuantity = row[10]?.split(' ')[2] || "";
          wineData.mineralSubstances = row[10]?.split(' ')[3] || "";
          wineData.bodyWine = row[11]?.split(' ')[0] || "";
          wineData.equilibrium = row[11]?.split(' ')[1] || "";
          wineData.tasteIntensity = row[12]?.split(' ')[0] || "";
          wineData.tastePersistence = row[12]?.split(' ')[1] || "";
          wineData.tasteQuality = row[12]?.split(' ')[2] || "";
          wineData.evolutionaryState = row[13]?.split(' ')[0] || "";
          wineData.harmony = row[13]?.split(' ')[1] || "";
          wineData.typicality = row[13]?.split(' ')[2] || "";

          wineData.user = "jEM1eyphCrb8xhCvcVQBZ32I1523";
          
          
          
          if (wineData.name != ""){
            console.log(`Vino ${wineData.name} aggiunto`);
            await db.collection(collectionName).add(wineData);
          }
          
        } catch (error) {
          console.error('Errore nell\'aggiunta del dato:', error);
        }
      })
      .on('end', () => {
        console.log(`\nImportazione completata. Totale righe importate: ${count}`);
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

function getColor(color: String, shade: String) {
  switch (color + " " + shade) {
    case 'Giallo verdolino':
      return 'yellow_greenish';
    case 'Giallo paglierino':
      return 'yellow_straw';
    case 'Giallo dorato':  
      return 'yellow_golden';
    case 'Giallo ambrato/aranciato':
      return 'yellow_golden';
    case 'Rosa tenue':
      return 'rose_soft';
    case 'Rosa ramato':  
      return 'rose_coppery';
    case 'Rosa cerasuolo':
      return 'rose_cherry';
    case 'Rosa chiaretto':
      return 'rose_claret';
    case 'Rosso porpora/violaceo':
      return 'red_purplish';
    case 'Rosso rubino':  
      return 'red_ruby';
    case 'Rosso granato':
      return 'red_garnet';
    case 'Rosso aranciato':
      return 'red_orange';
  }
}
