import { db } from '../../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { CityInfoState, HouseState } from './gameMapSlice';

const houseRef = doc(db, 'cities', 'YFbhq5M8vFBIUMMWZhqo');

export async function fetchCityInfo(cityId: string) {
  const cityRef = doc(db, 'cities', cityId);
  const docSnapshot = await getDoc(cityRef);
  return new Promise<{ data: CityInfoState }>((resolve) =>
    resolve({ data: docSnapshot.data() as CityInfoState })
  ); //TODO what if failed?
}

export async function saveCity(cityId: string, newHouses: HouseState[]) {
  // console.log(cityId);
  const cityRef = doc(db, 'cities', cityId);

  await updateDoc(cityRef, { houses: newHouses });
  // return response;

  // } catch (error) {
  //   console.error('Error updating document: ', error);
  //   throw error;
  // }
}
