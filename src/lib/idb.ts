const DB_NAME = 'image-gallery-db';
const STORE = 'images';

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
		};
		req.onerror = () => reject(req.error);
		req.onsuccess = () => resolve(req.result);
	});
}

export async function idbSet(key: string, value: Blob): Promise<void> {
	const db = await openDB();
	await new Promise<void>((resolve, reject) => {
		const tx = db.transaction(STORE, 'readwrite');
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.objectStore(STORE).put(value, key);
	});
}

export async function idbGet(key: string): Promise<Blob | undefined> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, 'readonly');
		tx.onerror = () => reject(tx.error);
		const req = tx.objectStore(STORE).get(key);
		req.onsuccess = () => resolve(req.result as Blob | undefined);
		req.onerror = () => reject(req.error);
	});
}
