import React, { useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { City } from './City';
import { getCityInfo } from '../../redux/reducers/cityBasicInfoSlice';
import { DialogBoard } from '../../component/DialogBoard';
import { getAuth, signOut } from 'firebase/auth';

export const GameMap: React.FC = () => {
  const auth = getAuth();

  const dispatch = useAppDispatch();
  useEffect(() => {
    //TODO: onSnapshot
    // console.log('activate');
    dispatch(getCityInfo());
  }, [dispatch]);

  return (
    <>
      {/* <DialogBoard /> */}
      <City />
      <br />
      <br />
      <Link to="/ledger">ledger</Link>
      <br />
      <br />
      <Link to="/statistics">statistics</Link>
      <br />
      <br />
      <button onClick={() => signOut(auth)}>Sign out</button>
    </>
  );
};
