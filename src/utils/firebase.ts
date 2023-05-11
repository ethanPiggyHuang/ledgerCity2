import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { CityBasicInfoState, HouseState } from '../redux/reducers/citySlice';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: 'ethanappproject.firebaseapp.com',
  projectId: 'ethanappproject',
  storageBucket: 'ethanappproject.appspot.com',
  messagingSenderId: '231623564219',
  appId: '1:231623564219:web:117555a40c6327701e429e',
  measurementId: 'G-T25FFKR3Q0',
  databaseURL:
    'https://ethanappproject-default-rtdb.asia-southeast1.firebasedatabase.app',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

const api = {
  city: {
    async updateHouseArrangement(cityId: string, newHouses: HouseState[]) {
      const cityRef = doc(db, 'cities', cityId);
      await updateDoc(cityRef, { houses: newHouses });
    },
    async updateCityName(cityId: string, cityName: string) {
      const cityRef = doc(db, 'cities', cityId);
      await updateDoc(cityRef, { cityName: cityName });
    },
  },
};

export default api;
