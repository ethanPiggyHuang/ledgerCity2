import React, { useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { City } from './City';
import { getCityInfo } from '../../redux/reducers/cityBasicInfoSlice';
import { DialogBoard } from '../../component/DialogBoard';
import { getAuth, signOut } from 'firebase/auth';
import { rtdb } from '../../config/firebase';
import { ref, set } from 'firebase/database';

export const GameMap: React.FC = () => {
  const auth = getAuth();

  const dispatch = useAppDispatch();
  useEffect(() => {
    //TODO: onSnapshot
    // console.log('activate');
    dispatch(getCityInfo());
  }, [dispatch]);

  useEffect(() => {
    const logOutTime = () => {
      const user = 'isLogin';
      if (user === 'isLogin') {
        const user = { uid: 'myCPVIkcOYalDVvdj9hngfml3yq2' };
        const logoutTime = new Date().getTime();
        // if (document.hidden) {
        set(ref(rtdb, `users/${user.uid}/offline`), {
          logoutTime: logoutTime,
        });
        // }
      }
    };

    // window.addEventListener('visibilitychange', logOutTime); // 網頁被切換掉、縮小、關閉，document.hidden 要是 true
    // window.addEventListener('pagehide', logOutTime); // 離開此頁導向其他網站，不實用
    window.addEventListener('offline', logOutTime); //離線
    // window.addEventListener('beforeunload', logOutTime); //關閉頁面
    // window.addEventListener('unload', logOutTime); //關閉頁面
  }, []);

  // 記錄使用者的登出時間到 Firebase Realtime Database 中

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
      <br />
      <br />
      {/* <button onClick={() => getInfo()}>Get realtime db info</button> */}
    </>
  );
};
