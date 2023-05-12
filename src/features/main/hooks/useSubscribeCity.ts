import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { useDispatch } from 'react-redux';
import { GET_CITY_INFO } from '../../../redux/reducers/citySlice';
import { useEffect } from 'react';
import { CityBasicInfoState } from '../../../utils/interface';

const useSubscribeCity = (cityList: string[]) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (cityList.length !== 0) {
      const q = doc(db, 'cities', cityList[0]);
      const unsubscribe = onSnapshot(q, (doc) => {
        const cityInfo = doc.data();
        dispatch(GET_CITY_INFO(cityInfo as CityBasicInfoState));
      });
      return () => unsubscribe();
    }
  }, [cityList, dispatch]);
};

export default useSubscribeCity;
