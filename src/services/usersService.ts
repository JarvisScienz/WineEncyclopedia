import { getFirestore, collection, getDoc, query, where, updateDoc, setDoc, doc, addDoc, deleteField } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '../config/firebase.js';

const db = getFirestore();
const auth = getAuth(firebaseApp.app);

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
export const removeReviewService = async (uid: string, wineryID: string): Promise<void> => {
	const userRef = doc(db, "users", uid);
	await updateDoc(userRef, { [`reviews.${wineryID}`]: deleteField() });
};

export const updateUserInformationService = async (uid: string, name: string, email: string, tastingSchema?: string): Promise<void> => {
	const userRef = doc(db, "users", uid);
	const data: Record<string, any> = { name, email };
	if (tastingSchema) data.tastingSchema = tastingSchema;
	await setDoc(userRef, data, { merge: true });
};

export const changePasswordService = async (uid: string, oldPassword: string, newPassword: string): Promise<void> => {
	// Get email from Firebase Auth (works even if Firestore doc doesn't exist yet)
	const userRecord = await firebaseApp.admin.auth().getUser(uid);
	const email = userRecord.email;
	if (!email) throw new Error("User email not found.");

	// Verify old password by attempting sign-in
	await signInWithEmailAndPassword(auth, email, oldPassword);

	// Update password via Admin SDK
	await firebaseApp.admin.auth().updateUser(uid, { password: newPassword });
};

export default { getUserInformationService, saveReviewService, updateUserInformationService, changePasswordService };