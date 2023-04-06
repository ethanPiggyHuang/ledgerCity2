import { db } from '../../config/firebase';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';

const housesRef = collection(db, 'cities', 'YFbhq5M8vFBIUMMWZhqo', 'houses');

interface HouseData {
  type?: string;
  position?: { x: number; y: number };
  height?: number;
}

export async function fetchCity() {
  const q = query(housesRef, where('height', '>', 0));
  const housesSnapshot = await getDocs(q);
  let data: HouseData[] = [];

  housesSnapshot.forEach((house) => {
    // console.log(house.data());
    data.push(house.data());
  });
  return new Promise<{ data: HouseData[] }>((resolve) =>
    resolve({ data: data })
  );
}
