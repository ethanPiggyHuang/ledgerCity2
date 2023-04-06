import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAx-Bkt_ELVtL30qtELE7X2PfDzxJqm7O8',
  authDomain: 'ethanappproject.firebaseapp.com',
  projectId: 'ethanappproject',
  storageBucket: 'ethanappproject.appspot.com',
  messagingSenderId: '231623564219',
  appId: '1:231623564219:web:117555a40c6327701e429e',
  measurementId: 'G-T25FFKR3Q0',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
