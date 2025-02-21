import { getFirestore, collection, getDoc, query, where, updateDoc, doc, addDoc } from 'firebase/firestore';

const db = getFirestore();

export const getUserInformationService = async (uid: string): Promise<Partial<User> | null> => {
	const userRef = doc(db, "users", uid);
	const docSnap = await getDoc(userRef);
	return docSnap.exists() ? docSnap.data() as Partial<User>: null;
};

export default { getUserInformationService };