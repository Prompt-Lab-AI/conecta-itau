import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  onSnapshot, 
  setDoc, 
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Manifestation, Secretariat, StaffUser } from '../types';
import { INITIAL_MANIFESTATIONS, INITIAL_SECRETARIATS, INITIAL_STAFF_USERS } from '../data/initialData';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore using the configured database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Validate Connection on Boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore está em modo offline ou aguardando conexão.');
    }
    return false;
  }
}

// Collections references
const MANIFESTATIONS_COL = 'manifestations';
const SECRETARIATS_COL = 'secretariats';
const STAFF_COL = 'staff_users';

/**
 * Real-time listener for Manifestations
 */
export function subscribeToManifestations(callback: (manifestations: Manifestation[]) => void) {
  const q = query(collection(db, MANIFESTATIONS_COL), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      // If Firestore is empty, seed initial data
      seedInitialData();
      return;
    }

    const items: Manifestation[] = [];
    snapshot.forEach((docSnap) => {
      items.push(docSnap.data() as Manifestation);
    });
    callback(items);
  }, (err) => {
    console.error('Erro ao ouvir manifestações do Firestore:', err);
  });
}

/**
 * Real-time listener for Secretariats
 */
export function subscribeToSecretariats(callback: (secretariats: Secretariat[]) => void) {
  const colRef = collection(db, SECRETARIATS_COL);
  return onSnapshot(colRef, (snapshot) => {
    if (!snapshot.empty) {
      const items: Secretariat[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Secretariat);
      });
      callback(items);
    }
  });
}

/**
 * Real-time listener for Staff Users
 */
export function subscribeToStaffUsers(callback: (users: StaffUser[]) => void) {
  const colRef = collection(db, STAFF_COL);
  return onSnapshot(colRef, (snapshot) => {
    if (!snapshot.empty) {
      const items: StaffUser[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as StaffUser);
      });
      callback(items);
    }
  });
}

/**
 * Save new or updated manifestation to Firestore
 */
export async function persistManifestation(manifestation: Manifestation) {
  try {
    const docRef = doc(db, MANIFESTATIONS_COL, manifestation.protocol);
    await setDoc(docRef, manifestation, { merge: true });
  } catch (err) {
    console.error('Erro ao persistir manifestação no Firestore:', err);
  }
}

/**
 * Save or update secretariat
 */
export async function persistSecretariat(secretariat: Secretariat) {
  try {
    const docRef = doc(db, SECRETARIATS_COL, secretariat.id);
    await setDoc(docRef, secretariat, { merge: true });
  } catch (err) {
    console.error('Erro ao persistir secretaria no Firestore:', err);
  }
}

/**
 * Save or update staff user
 */
export async function persistStaffUser(user: StaffUser) {
  try {
    const docRef = doc(db, STAFF_COL, user.id);
    await setDoc(docRef, user, { merge: true });
  } catch (err) {
    console.error('Erro ao persistir servidor no Firestore:', err);
  }
}

/**
 * Seeds initial mock data to Firestore if database is initially fresh
 */
async function seedInitialData() {
  try {
    const checkDocs = await getDocs(collection(db, MANIFESTATIONS_COL));
    if (checkDocs.empty) {
      for (const m of INITIAL_MANIFESTATIONS) {
        await setDoc(doc(db, MANIFESTATIONS_COL, m.protocol), m);
      }
      for (const s of INITIAL_SECRETARIATS) {
        await setDoc(doc(db, SECRETARIATS_COL, s.id), s);
      }
      for (const u of INITIAL_STAFF_USERS) {
        await setDoc(doc(db, STAFF_COL, u.id), u);
      }
    }
  } catch (e) {
    console.warn('Seed inicial concluído ou Firestore em transição:', e);
  }
}

// Run test connection
testFirestoreConnection();
