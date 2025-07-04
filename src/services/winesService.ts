import { getFirestore, collection, getDocs, query, where, updateDoc, doc, addDoc, arrayUnion, increment, getDoc } from 'firebase/firestore';

const db = getFirestore();

export const getWines = async (): Promise<Partial<Wine>[]> => {
	const winesCollection = collection(db, "wines");
	const snapshot = await getDocs(winesCollection);
	return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Partial<Wine>));
};

export const winesByWinery = async (winery: string): Promise<Partial<Wine>[]> => {
	if (!winery) {
		return [];
	}
	const winesWineryQuery = query(collection(db, 'wines'), where('wineryName', '==', winery));
	const snapshot = await getDocs(winesWineryQuery);
	return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Partial<Wine>));
};

export const winesById = async (id: string): Promise<Partial<Wine>> => {
	const wineDocRef = doc(db, 'wines', id);
	const snapshot = await getDoc(wineDocRef);
	return snapshot.data() as Partial<Wine>;
};

export const getSimilarWines = async (wine: Partial<Wine>): Promise<Partial<Wine>[]> => {
	if (!wine.denomination || !wine.color) {
		return [];
	}
	const winesWineryQuery = query(collection(db, 'wines'), where('denomination', '==', wine.denomination), where('color', '==', wine.color));
	const snapshot = await getDocs(winesWineryQuery);
	return snapshot.docs
	.map(doc => doc.data() as Partial<Wine>)
	.filter(wineItem => wineItem.wineryName !== wine.wineryName);
};

export const addWine = async (wine: Partial<Wine>): Promise<string> => {
	try {
		const newDocRef = await addDoc(collection(db, 'wines'), wine);
		return newDocRef.id;
	} catch (error) {
		console.log('[ERROR] Failed to add wine. Error:', error);
		throw new Error('An error occurred while adding the wine. Please try again later.');
	}
}

export const addWines = async (wines: Partial<Wine>[]): Promise<string[]> => {
	try {
		const newDocRefs = await Promise.all(wines.map(async (wine) => {
		const newDocRef = await addDoc(collection(db, 'wines'), wine);
		const wineryid = wine.winery;
		if (wineryid != undefined) {
			const wineryDoc = doc(db, 'wineries', wineryid);
			await updateDoc(wineryDoc, { wines: arrayUnion(newDocRef.id) });
		}
		return newDocRef.id;
	}));
		return newDocRefs;
	} catch (error) {
		console.log('[ERROR] Failed to add wines. Error:', error);
		throw new Error('An error occurred while adding the wines. Please try again later.');
	}
}

export const incrementWineTastedCount = async (wineID: string): Promise<void> => {
	const wineDocRef = doc(db, 'wines', wineID);
	await updateDoc(wineDocRef, { tastedCount: increment(1) });
}


export default { getWines, winesByWinery, addWine, addWines, incrementWineTastedCount, winesById };