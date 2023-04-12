import React, { useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { City } from './City';
import Login from '../login/Login';
import { getCityInfo } from '../../redux/reducers/cityBasicInfoSlice';
import { DialogBoard } from '../../component/DialogBoard';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { rtdb } from '../../config/firebase';
import { ref, set } from 'firebase/database';

export const GameMap: React.FC = () => {
  const auth = getAuth();
  const [hasUser, serHasUser] = useState(false);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getCityInfo());
  }, [dispatch]);

  useEffect(() => {
    const AuthCheck = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('hasUser', user.uid);
        serHasUser(true);
      } else {
        console.log('unauthorized');
        serHasUser(false);
      }
    });
  }, [auth]);

  useEffect(() => {
    // const logOutTime = () => {
    //   const user = 'isLogin';
    //   if (user === 'isLogin') {
    //     const user = { uid: 'myCPVIkcOYalDVvdj9hngfml3yq2' };
    //     const logoutTime = new Date().getTime();
    //     // if (document.hidden) {
    //     set(ref(rtdb, `users/${user.uid}/offline`), {
    //       logoutTime: logoutTime,
    //     });
    //     // }
    //   },
    // };
    // window.addEventListener('visibilitychange', logOutTime); // 網頁被切換掉、縮小、關閉，document.hidden 要是 true
    // window.addEventListener('pagehide', logOutTime); // 離開此頁導向其他網站，不實用
    // window.addEventListener('offline', logOutTime); //離線
    // window.addEventListener('beforeunload', logOutTime); //關閉頁面
    // window.addEventListener('unload', logOutTime); //關閉頁面
  }, []);

  // if (Login) return;

  return (
    <>
      {!hasUser && <DialogBoard />}
      <City />
      <br />
      <br />
      <Link to="/ledger">ledger</Link>
      <br />
      <br />
      <Link to="/statistics">statistics</Link>
      <br />
      <br />
      <button
        onClick={() => {
          signOut(auth);
        }}
      >
        Sign out
      </button>
      <br />
      <br />
      {/* <button onClick={() => getRTDB()}>Get realtime db info</button> */}
    </>
  );
};
