import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { CityBasicInfoState, HouseState } from '../reducers/citySlice';

export async function fetchCityInfo(cityId: string) {
  const cityRef = doc(db, 'cities', cityId);
  const docSnapshot = await getDoc(cityRef);
  return new Promise<{ data: CityBasicInfoState }>((resolve) =>
    resolve({ data: docSnapshot.data() as CityBasicInfoState })
  );
}

export async function updateHouseArrangement(
  cityId: string,
  newHouses: HouseState[]
) {
  const cityRef = doc(db, 'cities', cityId);
  await updateDoc(cityRef, { houses: newHouses });
}

export async function updateCityName(cityId: string, cityName: string) {
  const cityRef = doc(db, 'cities', cityId);
  await updateDoc(cityRef, { cityName: cityName });
}

export async function pickRandomPosition(
  emptyPostions: { yIndex: number; xIndex: number }[]
) {
  // if (emptyPostions.length === 0) {
  //   alert('請聯繫遊戲團隊(makoto31996@gmail.com)');
  // } else {
  const picked = Math.floor(Math.random() * emptyPostions.length);
  return new Promise<{ data: { yIndex: number; xIndex: number } }>((resolve) =>
    resolve({ data: emptyPostions[picked] })
  );
  // }
}
