import { getFirestore, collection, getDocs, query, where, updateDoc, doc, addDoc } from 'firebase/firestore';
import { incrementWineTastedCount } from './winesService.js';

const db = getFirestore();

export const getWinesByColorService = async (colorsArray :string[]): Promise<Partial<WineTasted>[]> => {
	const winesColorQuery = query(collection(db, 'wine-tasted'), where('color', 'in', colorsArray));
	const snapshot = await getDocs(winesColorQuery);

	return snapshot.docs.map(doc => ( { ...doc.data() }  as Partial<WineTasted>));
};

export const getWinesTastedService = async (uid: string): Promise<Partial<WineTasted>[]> => {
	const winesCollection = query(collection(db, "wine-tasted"), where('user', '==', uid));
	const snapshot = await getDocs(winesCollection);
	return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Partial<WineTasted>));
};

export const getWineTastedInYears = async (uid: string): Promise<any> => {
	const winesCollection = query(collection(db, "wine-tasted"), where('user', '==', uid));
	const snapshot = await getDocs(winesCollection);
	const wineCount: any = {};
      
            snapshot.forEach((doc) => {
              const data = doc.data();
              if (data.createdAt) {
                const year = new Date(data.createdAt).getFullYear();
                wineCount[year] = (wineCount[year] || 0) + 1;
              }
            });

	return wineCount;
};

export const addWineTastedService = async (wine: WineTasted): Promise<String> => {
	incrementWineTastedCount(wine.wineId);
	const newDocRef = await addDoc(collection(db, 'wine-tasted'), wine);
	return newDocRef.id;
};

export const editWineTastedService = async (wine: Partial<WineTasted>): Promise<string> => {
	try {
		const { id, ...wineData } = wine;
		if (!id) {
			throw new Error("Wine ID is required to update the document.");
		}
		const docRef = doc(db, 'wine-tasted', id);
		await updateDoc(docRef, wineData);
		return docRef.id;
	} catch (error) {
		console.log('[ERROR] Failed to update wine information. Error:', error);
		throw new Error('An error occurred while updating the wine information. Please try again later.');
	}
}

export default { getWinesByColorService, getWinesTastedService, getWineTastedInYears, addWineTastedService, editWineTastedService };