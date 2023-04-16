import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { City } from './City';
import { SideBar } from './SideBar';
import { NavBar } from './NavBar';
import { ScaleBar } from './ScaleBar';
import { DialogBoard } from '../../component/DialogBoard';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getCityInfo } from '../../redux/reducers/cityBasicInfoSlice';
import { GET_COOP_FRIEND_ACTIVITY } from '../../redux/reducers/usersActivitySlice';
import {
  postFadeOutTime,
  postFadeOutTimeRT,
  updateLocation,
} from '../../redux/api/userAPI';

export const GameMap: React.FC = () => {
  const { isLogin, isAuthing } = useAppSelector(
    (state) => state.userInfo.loginStatus
  );
  const { userId } = useAppSelector((state) => state.userInfo.data.user);

  const dispatch = useAppDispatch();

  // 從 db 獲取 city 資料
  useEffect(() => {
    dispatch(getCityInfo());
    // 要改成從 db 匯入
  }, []);

  // 監聽使用者（關閉/離開）網頁動態 -> 送到 db
  useEffect(() => {
    if (userId) {
      const logOutTime = (enableType: string) => {
        // const logoutTime = new Date().getTime();
        if (
          enableType === 'visibilitychange' &&
          document.hidden
          // || enableType === 'offline'
        ) {
          postFadeOutTime(userId);
          // postFadeOutTimeRT(userId, enableType);
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
    }
  }, [userId]);

  // 監聽好友動態（一人）
  useEffect(() => {
    if (userId) {
      const unsubscribe = onSnapshot(
        doc(db, 'allUserStatus', userId),
        (doc) => {
          if (doc) {
            const data = doc.data();
            if (data) {
              const { fadeOutTime, isEditingCity, latestActiveTime } = data;
              const fadeOutTimeSecond = fadeOutTime?.seconds;
              const latestActiveTimeSecond = latestActiveTime?.seconds;
              const currentPage = data?.currentPage as
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
        }
      );

      // Stop listening to changes
      return () => unsubscribe();
    }
  }, [userId]);

  // 監聽使用者進入頁面 -> 送到 db
  useEffect(() => {
    if (userId) updateLocation(userId, 'city');
  }, [userId]);

  return (
    <Wrapper>
      {!isLogin && !isAuthing && <DialogBoard />}
      <City />
      <SideBar />
      <NavBar />
      <ScaleBar />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  position: relative;
`;
