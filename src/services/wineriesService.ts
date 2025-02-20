import { getFirestore, collection, getDocs, query, where, updateDoc, doc, addDoc } from 'firebase/firestore';

const db = getFirestore();

export const getWineriesService = async (): Promise<Partial<Wine>[]> => {
	const wineriesCollection = collection(db, "wineries");
	const snapshot = await getDocs(wineriesCollection);
	return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Partial<Winery>));
};

export const getWineriesListService = async (): Promise<Partial<Winery>[]> => {
	const wineriesCollection = collection(db, "wineries");
	const snapshot = await getDocs(wineriesCollection);
	return snapshot.docs.map(doc => ( doc.data().name  as Partial<Winery>));
};

export const addWineriesService = async (wineries: Partial<Winery>[]): Promise<string[]> => {
	try {
		const newDocRefs = await Promise.all(wineries.map(async (winery) => {
			const newDocRef = await addDoc(collection(db, 'wineries'), winery);
			return newDocRef.id;
		}));
		return newDocRefs;
	} catch (error) {
		console.log('[ERROR] Failed to add wineries. Error:', error);
		throw new Error('An error occurred while adding the wines. Please try again later.');
	}
}

export default { getWineriesService, getWineriesListService, addWineriesService };