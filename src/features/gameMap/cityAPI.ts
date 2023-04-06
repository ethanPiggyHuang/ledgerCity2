import { db } from '../../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
} from 'firebase/firestore';

const cityRef = doc(db, 'cities', 'YFbhq5M8vFBIUMMWZhqo');
const houseRef = doc(
  db,
  'cities',
  'YFbhq5M8vFBIUMMWZhqo',
  'houses',
  'dsfefdvsdfe'
);

interface HouseData {
  type: string;
  position: { x: number; y: number };
  height: number;
}

export async function fetchCity() {
  // const q = query(housesRef, where('height', '>', 0));
  const docSnapshot = await getDoc(cityRef);
  let data: HouseData[] = [];

  if (docSnapshot) {
    docSnapshot.data().houses.forEach((house: HouseData) => {
      //TODO typescript
      console.log(house);
      data.push(house);
    });
  }
  return new Promise<{ data: HouseData[] }>((resolve) =>
    resolve({ data: data })
  ); //TODO what if failed?
}

export async function saveCity() {
  const newDocData = { type: 'food', position: { x: 0, y: 1 }, height: 1 };
  await setDoc(houseRef, newDocData);
  return new Promise<{ data: number }>((resolve) => resolve({ data: 99 }));
}
