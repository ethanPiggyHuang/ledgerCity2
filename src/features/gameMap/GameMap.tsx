import React, { useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { useAppDispatch } from '../../app/hooks';
import { City } from './City';
import { getCityInfo } from './gameMapSlice';
import { Link } from 'react-router-dom';

export const GameMap: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    //TODO: onSnapshot
    dispatch(getCityInfo());
  }, []);

  return (
    <>
      <City />
      <br />
      <Link to="/ledger">ledger</Link>
    </>
  );
};
