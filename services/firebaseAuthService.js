const firebase = require("../db");

// Funzione per verificare l'autenticazione dell'utente tramite email e password
async function verifyUserFirestore(uid, email, password) {
	try {
		var userConnected = false;
		const userRef = firebase.db.collection("users");
		const snapshot = await userRef.where('email', '==', email).where('password', '==', password).get();
		if (!snapshot.empty) {
			console.log("User connected");
    		userConnected = true;
		}

	    return userConnected;
	} catch (error) {
		console.error('Errore durante la verifica delle credenziali:', error);
  }
}

async function verifyUserAuth(email, password) {
	console.log("Email: " + email);
	try {
	    const userCredential = await firebase.firebase.auth().getUserByEmail(email);
	    console.log('L\'utente è autenticato. UID:', userCredential.uid);
	    var userConnected = verifyUserFirestore(userCredential.uid, email, password);
	    if (userConnected){
	    	return userCredential;
	    }else{
	    	return null;
	    }
	  } catch (error) {
	    console.error('Errore durante la verifica dell\'autenticazione:', error);
	    return null;
	  }
	}

async function createUser(email, password) {
	try {
		const userRecord = await firebase.firebase.auth().createUser({
		      email: email,
		      password: password,
		    });

		    console.log('Nuovo utente creato con UID:', userRecord.uid);
		    createUserFirestore(userRecord.uid, email, password);
		    return userRecord.uid;
	  } catch (error) {
	    console.error('Errore durante la creazione dell\'utente:', error);
	    return null;
	  }
	}

async function createUserFirestore(uid, email, password) {
	const userRef = await firebase.db.collection("users").doc(uid).set({
	    email: email,
	    password: password
	})
	
}

module.exports = { verifyUserAuth, createUser };