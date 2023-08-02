const firebase = require("../db").db;

async function getWines (){
	try {
		const snapshot = await firebase.collection("wines").get();
	    const data = [];

	    snapshot.forEach((doc) => {
	      data.push(doc.data());
	    });

	    return data;
	} catch (error) {
    console.error('Errore durante l\'esecuzione delle query:', error);
  }
}

async function getWinesByUser (uid){
	try {
		const snapshot = await firebase.collection("wines").where('user', '==', uid).get();
	    const data = [];

	    snapshot.forEach((doc) => {
	      data.push(doc.data());
	    });

	    return data;
	} catch (error) {
    console.error('Errore durante l\'esecuzione delle query:', error);
  }
}

async function getWinesByColor (color){
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
		const data = [];
		const winesRef = firebase.collection('wines');
		//const snapshot = await winesRef.where('color', '==', color2).get();
		/*const snapshot = await winesRef.where(
			Filter.or(
		      Filter.where('color', '==', color1),
		      Filter.where('color', '==', color2),
		      Filter.where('color', '==', color3),
		      Filter.where('color', '==', color4)
		    )).get();*/
		const colorsArray = [color1, color2, color3, color4];
		const snapshot = await winesRef.where('color', 'in', colorsArray).get();
		if (snapshot.empty) {
		  console.log('No matching documents.');
		  return;
		}  

		snapshot.forEach(doc => {
			data.push(doc.data());
		});

	    return data;
	} catch (error) {
    console.error('Errore durante l\'esecuzione delle query:', error);
  }
}

async function getWinesByWinery (winery){
	try {
		const data = [];
		const winesRef = firebase.collection('wines');
		const snapshot = await winesRef.where('winery', '==', winery).get();
		if (snapshot.empty) {
		  console.log('No matching documents.');
		  return;
		}  

		snapshot.forEach(doc => {
			data.push(doc.data());
		});

	    return data;
	} catch (error) {
    console.error('Errore durante l\'esecuzione delle query:', error);
  }
}

async function addWine(wine){
	const usersRef = firebase.collection('wines');
    const newDocRef = usersRef.doc();
    await newDocRef.set(wine);
    console.log('Nuovo documento creato con ID:', newDocRef.id);
    updateNewWineId(newDocRef.id);
}

async function updateWine (wine){
	const usersRef = firebase.collection('wines');
	console.log("wine id: " + wine.id);
    const docToUpdateRef = usersRef.doc(wine.id);
    const updatedData = wine;
    await docToUpdateRef.update(updatedData);
    console.log('Documento aggiornato correttamente.');
}

async function deleteWine (){
	const usersRef = firebase.collection('wines');
	const docToDeleteRef = usersRef.doc('fzC4wMzjITY5Qv2s1l74');
    await docToDeleteRef.delete();
    console.log('Documento eliminato correttamente.');
}

function updateNewWineId (id){
	const usersRef = firebase.collection('wines');
    const docToUpdateRef = usersRef.doc(id);
    const updatedData = {
      id: id
    };
    docToUpdateRef.update(updatedData);
}

module.exports = { getWines, getWinesByUser, getWinesByColor, getWinesByWinery, addWine, updateWine, deleteWine};