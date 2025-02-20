const firebase = require("../db").db;

async function getGrapes (){
	try {
		const snapshot = await firebase.collection("grapes").get();
	    const data = [];

	    snapshot.forEach((doc) => {
	      data.push(doc.data());
	    });

	    return data;
	} catch (error) {
    console.error('Errore durante l\'esecuzione delle query:', error);
  }
}

async function getGrapesName (){
	try {
		const snapshot = await firebase.collection("grapes").get();
	    const data = [];

	    snapshot.forEach((doc) => {
	      data.push(doc.data().name);
	    });

	    return data;
	} catch (error) {
    console.error('Errore durante l\'esecuzione delle query:', error);
  }
}

async function addGrape(grape){
	const grapeRef = firebase.collection("wines").doc(grape.name).set({
	    name: grape.name
	})
	
    console.log('Nuovo documento creato con ID:', grapeRef.id);
}

module.exports = { getGrapes, getGrapesName, addGrape};