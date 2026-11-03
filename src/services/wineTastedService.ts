import { getFirestore, collection, getDocs, getDoc, query, where, updateDoc, deleteDoc, doc, addDoc, orderBy, limit, startAfter } from 'firebase/firestore';
import { incrementWineTastedCount, decrementWineTastedCount } from './winesService.js';

const db = getFirestore();

export const getWinesByColorService = async (colorsArray :string[]): Promise<Partial<WineTasted>[]> => {
	const winesColorQuery = query(collection(db, 'wine-tasted'), where('color', 'in', colorsArray));
	const snapshot = await getDocs(winesColorQuery);

	return snapshot.docs.map(doc => ( { ...doc.data(), id: doc.id }  as Partial<WineTasted>));
};

export const getWinesTastedService = async (uid: string, pageSize: number = 20, lastDocId: string | null = null): Promise<Partial<WineTasted>[]> => {
	const constraints: any[] = [
		where('user', '==', uid),
		orderBy('createdAt', 'desc'),
	];

	if (lastDocId !== null) {
		const lastDocSnap = await getDoc(doc(db, 'wine-tasted', lastDocId));
		if (lastDocSnap.exists()) {
			constraints.push(startAfter(lastDocSnap));
		}
	}

	constraints.push(limit(pageSize));

	const winesCollection = query(collection(db, "wine-tasted"), ...constraints);
	const snapshot = await getDocs(winesCollection);
	return snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Partial<WineTasted>));
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
	// L'id è quello del documento Firestore: non va salvato anche come campo (vuoto) nel documento.
	const { id: _ignoredId, ...wineData } = wine as any;
	const newDocRef = await addDoc(collection(db, 'wine-tasted'), wineData);
	// La scheda è già salvata: l'incremento del contatore non deve far fallire l'intera operazione.
	// Se il vino non è stato selezionato dal catalogo (wineId vuoto) non c'è nulla da incrementare.
	if (wine.wineId) {
		try {
			await incrementWineTastedCount(wine.wineId);
		} catch (error) {
			console.error(`[WARN] addWineTastedService. Tasting ${newDocRef.id} saved, but tastedCount increment failed for wineId "${wine.wineId}". `, error);
		}
	} else {
		console.warn(`[WARN] addWineTastedService. Tasting ${newDocRef.id} saved without wineId: tastedCount not incremented.`);
	}
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

export const deleteWineTastedService = async (id: string, uid: string): Promise<void> => {
	const docRef = doc(db, 'wine-tasted', id);
	const snap = await getDoc(docRef);
	if (!snap.exists()) {
		throw Object.assign(new Error('Tasting not found.'), { code: 'not-found' });
	}
	const data = snap.data();
	if (data.user !== uid) {
		throw Object.assign(new Error('Tasting does not belong to this user.'), { code: 'permission-denied' });
	}
	await deleteDoc(docRef);
	// La scheda è già eliminata: il decremento del contatore non deve far fallire l'operazione.
	if (data.wineId) {
		try {
			await decrementWineTastedCount(data.wineId);
		} catch (error) {
			console.error(`[WARN] deleteWineTastedService. Tasting ${id} deleted, but tastedCount decrement failed for wineId "${data.wineId}". `, error);
		}
	}
};

export default { deleteWineTastedService, getWinesByColorService, getWinesTastedService, getWineTastedInYears, addWineTastedService, editWineTastedService };