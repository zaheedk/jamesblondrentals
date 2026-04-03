/**
 * IndexedDB-based offline photo storage for vehicle inspection photos.
 * Photos are saved locally when uploads fail and can be synced later.
 */

const DB_NAME = "jb-vehicle-photos";
const DB_VERSION = 1;
const STORE_NAME = "pending-photos";

export interface OfflinePhoto {
  id: string;
  reservationRef: string;
  vehicleRego: string;
  fileName: string;
  blob: Blob;
  createdAt: number;
  status: "pending" | "uploading" | "failed";
  errorMessage?: string;
}

const openDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("reservationRef", "reservationRef", { unique: false });
        store.createIndex("status", "status", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const savePhotoOffline = async (
  photo: Omit<OfflinePhoto, "id" | "createdAt" | "status">,
): Promise<string> => {
  const db = await openDB();
  const id = `offline-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const record: OfflinePhoto = {
    ...photo,
    id,
    createdAt: Date.now(),
    status: "pending",
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(record);
    tx.oncomplete = () => resolve(id);
    tx.onerror = () => reject(tx.error);
  });
};

export const getPendingPhotos = async (reservationRef?: string): Promise<OfflinePhoto[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = reservationRef
      ? store.index("reservationRef").getAll(reservationRef)
      : store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllPendingCount = async (): Promise<number> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const updatePhotoStatus = async (
  id: string,
  status: OfflinePhoto["status"],
  errorMessage?: string,
): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const record = getReq.result;
      if (record) {
        record.status = status;
        if (errorMessage) record.errorMessage = errorMessage;
        store.put(record);
      }
      tx.oncomplete = () => resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
};

export const removePhoto = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const clearSyncedPhotos = async (ids: string[]): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    for (const id of ids) {
      store.delete(id);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};
