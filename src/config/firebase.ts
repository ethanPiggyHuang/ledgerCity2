import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: 'ethanappproject.firebaseapp.com',
  projectId: 'ethanappproject',
  storageBucket: 'ethanappproject.appspot.com',
  messagingSenderId: '231623564219',
  appId: '1:231623564219:web:117555a40c6327701e429e',
  measurementId: 'G-T25FFKR3Q0',
};

export const app = initializeApp(config);

export const db = getFirestore(app);
