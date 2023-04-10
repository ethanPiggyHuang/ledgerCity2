import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { CityBasicInfoState, HouseState } from '../reducers/cityBasicInfoSlice';

export async function fetchCityInfo(cityId: string) {
  const cityRef = doc(db, 'cities', cityId);
  const docSnapshot = await getDoc(cityRef);
  return new Promise<{ data: CityBasicInfoState }>((resolve) =>
    resolve({ data: docSnapshot.data() as CityBasicInfoState })
  ); //TODO what if failed?
}

export async function updateHousePosition(
  cityId: string,
  newHouses: HouseState[]
) {
  const cityRef = doc(db, 'cities', cityId);
  await updateDoc(cityRef, { houses: newHouses });
}
