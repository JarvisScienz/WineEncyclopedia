const firebase = require('firebase-admin');
const serviceAccount = require('./wineencyclopedia-245f5-firebase-adminsdk-5bhjd-b1ac58c49c.json'); 
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://wineencyclopedia-245f5.firebaseio.com'
});

// Ottieni un riferimento al database Firestore
const db = firebase.firestore();

module.exports = {db, firebase};
