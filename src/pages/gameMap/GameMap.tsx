import React, { useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { useAppDispatch } from '../../redux/hooks';
import { City } from './City';
import { getCityInfo } from '../../redux/reducers/cityBasicInfoSlice';
import { Link } from 'react-router-dom';

export const GameMap: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    //TODO: onSnapshot
    console.log('activate');
    dispatch(getCityInfo());
  }, [dispatch]);

  return (
    <>
      <City />
      <br />
      <br />
      <Link to="/ledger">ledger</Link>
      <br />
      <br />
      <Link to="/statistics">statistics</Link>
    </>
  );
};
