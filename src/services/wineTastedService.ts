import { getFirestore, collection, getDocs, query, where, updateDoc, doc, addDoc } from 'firebase/firestore';

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
	const newDocRef = await addDoc(collection(db, 'wine-tasted'), wine);
	return newDocRef.id;
};

export default { getWinesByColorService, getWinesTastedService, getWineTastedInYears, addWineTastedService };