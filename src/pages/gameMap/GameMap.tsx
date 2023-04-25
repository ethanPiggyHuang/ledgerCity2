import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { City } from './City';
import { DialogBoard } from '../../component/DialogBoard';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { postFadeOutTime, postFadeOutTimeRT } from '../../redux/api/userAPI';
import { Ledger } from '../ledger/Ledger';
import Footer from '../../component/Footer';
import { Statistics } from '../statistics/Statistics';
import { Profile } from '../profile/Profile';
import { SWITCH_PAGE } from '../../redux/reducers/pageControlSlice';

export const GameMap: React.FC = () => {
  const { isLogin, isAuthing } = useAppSelector(
    (state) => state.userInfo.loginStatus
  );
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { pageActivity } = useAppSelector((state) => state.pageControl);

  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (cityList.length !== 0) {
  //     dispatch(getCityInfo(cityList[0]));
  //     console.log('go fetch');
  //   }
  // }, [cityList]);

  // useEffect(() => {
  //   if (ledgerBookId.length !== 0) {
  //     dispatch(getLedgerList(ledgerBookId));
  //   }
  // }, [ledgerBookId]);

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

  // 監聽使用者進入頁面 -> 送到 db
  useEffect(() => {
    if (userId) {
      SWITCH_PAGE({ userId, pageActivity: 'city' });
      console.log('useEffect', userId);
    }
  }, [userId]);

  return (
    <Wrapper>
      {/* && status === 'loading' */}
      {!isLogin && !isAuthing && <DialogBoard />}
      <City />
      {/* <RearrangeOptions /> */}
      {/* <NavBar /> */}
      {/* <ScaleBar /> */}
      {(pageActivity === 'statistics' || pageActivity === 'profile') && (
        <BlackCurtain />
      )}
      {pageActivity === 'ledger' && <Ledger />}
      {pageActivity === 'statistics' && <Statistics />}
      {pageActivity === 'profile' && <Profile />}

      <Footer />
      {/* <CityShiftControl type={'down'} /> */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  position: relative;
  background: linear-gradient(#c8e2cc, #98d5da);
  overflow: hidden;
`;
const BlackCurtain = styled.div`
  height: calc(100vh - 100px);
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  background-color: black;
  opacity: 0.3;
`;
