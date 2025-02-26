import { getFirestore, collection, getDoc, query, where, updateDoc, doc, addDoc } from 'firebase/firestore';

const db = getFirestore();

export const getUserInformationService = async (uid: string): Promise<Partial<User> | null> => {
	const userRef = doc(db, "users", uid);
	const docSnap = await getDoc(userRef);
	return docSnap.exists() ? docSnap.data() as Partial<User>: null;
};

export const saveReviewService = async (uid: string, wineryID: string, review: string): Promise<void> => {
	const userRef = doc(db, "users", uid);
	const user = await getDoc(userRef);
	const userData = user.data();
	if (userData === undefined) {
		throw new Error("User not found.");
	}
	const updatedReviews = userData.reviews || {};

	// Aggiungi o aggiorna la recensione per quella specifica wineryID
	updatedReviews[wineryID] = review;

	// Aggiorna il documento
	await updateDoc(userRef, { reviews: updatedReviews });	
}
export default { getUserInformationService, saveReviewService };