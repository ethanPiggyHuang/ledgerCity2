import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { City } from './City';
import { getCityInfo } from '../../redux/reducers/cityBasicInfoSlice';
import { DialogBoard } from '../../component/DialogBoard';
import { getAuth, signOut } from 'firebase/auth';
import { postFadeOutTime, postFadeOutTimeRT } from '../../redux/api/userAPI';
import { GET_COOP_FRIEND_ACTIVITY } from '../../redux/reducers/usersActivitySlice';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { updateLocation } from '../../redux/api/userAPI';

export const GameMap: React.FC = () => {
  const auth = getAuth();
  const { isLogin, isAuthing } = useAppSelector(
    (state) => state.userInfo.loginStatus
  );
  const { userId } = useAppSelector((state) => state.userInfo.data.user);
  const constId = 'myCPVIkcOYalDVvdj9hngfml3yq2';
  const cooperatorLocation = useAppSelector(
    (state) => state.userActivity.data[constId]?.currentPage
  );
  const { isEditingCity, fadeOutTime, latestActiveTime } = useAppSelector(
    (state) => state.userActivity.data[constId]
  );

  const dispatch = useAppDispatch();

  // 從 db 獲取 city 資料
  useEffect(() => {
    dispatch(getCityInfo());
  }, []);

  // 監聽使用者（關閉/離開）網頁動態 -> 送到 db
  useEffect(() => {
    const logOutTime = (enableType: string) => {
      if (userId) {
        // const logoutTime = new Date().getTime();
        if (
          enableType === 'visibilitychange' &&
          document.hidden
          // || enableType === 'offline'
        ) {
          postFadeOutTime(userId);
          // postFadeOutTimeRT(userId, enableType);
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
      window.removeEventListener(
        'visibilitychange',
        () => logOutTime('visibilitychange')
        //   window.removeEventListener('offline', () => logOutTime('offline'));
      );
    };
  }, [userId]);

  // 監聽好友動態（一人）
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'allUserStatus', userId), (doc) => {
      if (doc) {
        const data = doc.data();
        if (data) {
          const { fadeOutTime, isEditingCity, latestActiveTime } = data;
          const fadeOutTimeSecond = fadeOutTime?.seconds;
          const latestActiveTimeSecond = latestActiveTime?.seconds;
          const currentPage = data.currentPage as
            | 'city'
            | 'ledger'
            | 'statistics'
            | 'profile'
            | 'leave';
          dispatch(
            GET_COOP_FRIEND_ACTIVITY({
              userId,
              currentPage,
              isEditingCity,
              fadeOutTimeSecond,
              latestActiveTimeSecond,
            })
          );
        }
      }
    });

    // Stop listening to changes
    return () => unsubscribe();
  }, []);

  // 監聽使用者進入頁面 -> 送到 db
  useEffect(() => {
    if (userId) updateLocation(userId, 'city');
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
      <button onClick={() => signOut(auth)}>Sign out</button>
      <br />
      <br />
      <p>{`userId: ${userId}`}</p>
      <p>{`locatiton: ${cooperatorLocation}`}</p>
      <p>{`isEditingCity: ${isEditingCity}`}</p>
      <p>{`fadeOutTime: ${fadeOutTime ? new Date(fadeOutTime * 1000) : ''}`}</p>
      <p>{`latestActiveTime: ${
        latestActiveTime ? new Date(latestActiveTime * 1000) : ''
      }`}</p>
    </>
  );
};
