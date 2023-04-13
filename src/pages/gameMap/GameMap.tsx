import React, { useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { City } from './City';
import { getCityInfo } from '../../redux/reducers/cityBasicInfoSlice';
import { DialogBoard } from '../../component/DialogBoard';
import { getAuth, signOut } from 'firebase/auth';
import { postFadeOutTime, postFadeOutTimeRT } from '../../redux/api/userAPI';

export const GameMap: React.FC = () => {
  const auth = getAuth();
  const { isLogin, isAuthing } = useAppSelector(
    (state) => state.userInfo.loginStatus
  );
  const { userId } = useAppSelector((state) => state.userInfo.data.user);
  // const { accessUsers } = useAppSelector((state) => state.cityBasicInfo);

  const dispatch = useAppDispatch();
  useEffect(() => {
    // if (accessUsers.length === 0) {
    dispatch(getCityInfo());
    // console.log('getCityInfo');
    // }
  }, []);

  useEffect(() => {
    const logOutTime = (enableType: string) => {
      if (userId) {
        // const logoutTime = new Date().getTime();
        if (
          enableType === 'visibilitychange' &&
          document.hidden
          // || enableType === 'offline'
        ) {
          // postFadeOutTime(userId);
          postFadeOutTimeRT(userId, enableType);
        }
      }
    };

    // 網頁被切換掉、縮小、關閉時，document.hidden 變成 true
    window.addEventListener('visibilitychange', () =>
      logOutTime('visibilitychange')
    );
    // TODO: 離線 ???
    // window.addEventListener('offline', () => logOutTime('offline'));
    // window.addEventListener('pagehide', logOutTime); // 離開此頁導向其他網站，不太實用
    // window.addEventListener('beforeunload', logOutTime); //關閉頁面
    // window.addEventListener('unload', logOutTime); //關閉頁面

    return () => {
      window.removeEventListener('visibilitychange', () =>
        logOutTime('visibilitychange')
      );
      //   window.removeEventListener('offline', () => logOutTime('offline'));
    };
  }, [userId]);

  return (
    <>
      {!isLogin && !isAuthing && <DialogBoard />}
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
