import { db } from '../../config/firebase';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';

const housesRef = collection(db, 'cities', 'YFbhq5M8vFBIUMMWZhqo', 'houses');

export async function getHouses() {
  const q = query(housesRef, where('height', '>', 0));
  const housesSnapshot = await getDocs(q);
  housesSnapshot.forEach((house) => {
    console.log(' => ', house.data());
  });
}
