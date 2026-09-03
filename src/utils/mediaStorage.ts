import { SavedMediaItem } from '../types';

const DB_NAME = 'ShooserLocalDB';
const DB_VERSION = 1;
const STORE_NAME = 'saved_media';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMediaItem(item: SavedMediaItem): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(item);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save to IndexedDB, fallback to localStorage if photo', err);
    try {
      const stored = JSON.parse(localStorage.getItem('shooser_photos_backup') || '[]');
      stored.unshift({ ...item, blob: undefined });
      localStorage.setItem('shooser_photos_backup', JSON.stringify(stored.slice(0, 15)));
    } catch {}
  }
}

export async function getAllMediaItems(): Promise<SavedMediaItem[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const results = (request.result as SavedMediaItem[]) || [];
        // Sort latest first
        resolve(results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Could not read from IndexedDB, falling back to localStorage', err);
    try {
      return JSON.parse(localStorage.getItem('shooser_photos_backup') || '[]');
    } catch {
      return [];
    }
  }
}

export async function deleteMediaItem(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to delete media', err);
  }
}

export function downloadMediaFile(item: SavedMediaItem) {
  const a = document.createElement('a');
  a.href = item.url;
  a.download = `shooser_${item.playerName}_${item.type}_${Date.now()}.${item.type === 'video' ? 'webm' : 'jpg'}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
