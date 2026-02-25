import { getFirestore, collection, getDocs, query, where, updateDoc, doc, addDoc, orderBy, limit, startAfter, getDoc } from 'firebase/firestore';

const db = getFirestore();

export const getWineriesService = async (pageSize: number = 20, lastDocId: string | null = null): Promise<Partial<Winery>[]> => {
	const constraints: any[] = [orderBy('name')];

	if (lastDocId !== null) {
		const lastDocSnap = await getDoc(doc(db, 'wineries', lastDocId));
		if (lastDocSnap.exists()) {
			constraints.push(startAfter(lastDocSnap));
		}
	}

	constraints.push(limit(pageSize));

	const wineriesCollection = query(collection(db, "wineries"), ...constraints);
	const snapshot = await getDocs(wineriesCollection);
	return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Partial<Winery>));
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