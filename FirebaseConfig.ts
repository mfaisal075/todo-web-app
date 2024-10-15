import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA0sJT3FittzjZoOr9utPeLntnHAHOCapQ',
  authDomain: 'todoweb-5758f.firebaseapp.com',
  projectId: 'todoweb-5758f',
  storageBucket: 'todoweb-5758f.appspot.com',
  messagingSenderId: '378696404232',
  appId: '1:378696404232:web:52234dd8833aa0cc4270bd',
  measurementId: 'G-CRC993LFLL',
};

const app = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(app);
export const FIRESTORE_DB = getFirestore(app);
export const FIREBASE_STORAGE = getStorage(app);
