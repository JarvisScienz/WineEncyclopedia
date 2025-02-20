import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const db = getFirestore();

export const getMyCellarWinesService = async (uid :string): Promise<any> => {
	const myCellarWinesQuery = query(collection(db, 'my-cellar'), where('userID', '==', uid));
			const snapshot = await getDocs(myCellarWinesQuery);

	return snapshot.docs.map(doc => ( { ...doc.data() } as any));
};

export default { getMyCellarWinesService };