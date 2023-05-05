import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { City } from './City';
import { DialogBoard } from '../../component/DialogBoard';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { postFadeOutTime, postFadeOutTimeRT } from '../../redux/api/userAPI';
import { Ledger } from '../ledger/Ledger';
import Footer from '../../component/Footer';
import { Statistics } from '../statistics/Statistics';
import {
  SWITCH_PAGE,
  PANEL_CONTROL,
} from '../../redux/reducers/pageControlSlice';
import {
  CITY_SLOWLY_TRANSITION,
  RENAME_CITY,
  SET_CITY_LOCATION,
  CITY_SHIFT_END,
} from '../../redux/reducers/cityArrangementSlice';
import { CooperatorTrace } from './CooperatorTrace';
import { RearrangeOptions } from './RearrangeOptions';
import { ScaleBar } from './ScaleBar';
import { UserBar } from './UserBar';
import { Social } from '../profile/Social';
import { useNavigate } from 'react-router-dom';
import { CityShiftControl } from './CityShiftControl';
import { Alert } from '../../component/Alert';

export const GameMap: React.FC = () => {
  const { isLogin, isAuthing } = useAppSelector(
    (state) => state.userInfo.loginStatus
  );
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { pageActivity, panelOpened } = useAppSelector(
    (state) => state.pageControl
  );
  const { isRenaming, cityScrollShift, isRelocateActivate, isTouring } =
    useAppSelector((state) => state.cityArrangement);

  const navigate = useNavigate();

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
      dispatch(SWITCH_PAGE({ userId, pageActivity: 'city' }));
      // console.log('useEffect', userId);
    }
  }, [userId]);

  // if (!isLogin && !isAuthing) {
  //   navigate('/landing');
  // }

  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRelocateActivate) {
      cityRef.current?.scrollTo({
        top: cityScrollShift.y,
        left: cityScrollShift.x,
        behavior: 'smooth',
      });
      dispatch(CITY_SHIFT_END());
    }
  }, [isRelocateActivate]);

  return (
    <Wrapper>
      {/* && status === 'loading' */}
      {/* {!isLogin && !isAuthing && <DialogBoard />} */}
      {/* <button onClick={executeScroll}>scroll to</button> */}
      <UserBar />
      <CityWrapper
        $isTouring={isTouring}
        onClick={() => {
          if (panelOpened !== 'none') {
            dispatch(PANEL_CONTROL('none'));
          }
        }}
        ref={cityRef}
      >
        <City />
        {/* <City /> */}
      </CityWrapper>
      <RearrangeOptions props={cityRef.current} />
      {/* <NavBar /> */}
      {/* <ScaleBar /> */}
      <CooperatorTrace />
      {/* {(pageActivity === 'statistics' || pageActivity === 'profile') && ( */}
      <BlackCurtain
        $isShown={pageActivity === 'statistics' || pageActivity === 'profile'}
        onClick={() => {
          dispatch(SWITCH_PAGE({ userId, pageActivity: 'city' }));
          dispatch(PANEL_CONTROL('none'));
        }}
      />
      <InvisibleCurtain
        $isShown={pageActivity === 'ledger'}
        onClick={() => {
          dispatch(SWITCH_PAGE({ userId, pageActivity: 'city' }));
          dispatch(PANEL_CONTROL('none'));
          dispatch(CITY_SLOWLY_TRANSITION(false));
        }}
      />
      {/* )} */}
      {/* {pageActivity === 'ledger' && <Ledger />} */}
      <Ledger />
      <Statistics />
      <Social />
      <Footer />
    </Wrapper>
  );
};

type BlackCurtainProps = {
  $isShown: boolean;
};

const Wrapper = styled.div`
  height: 100vh;
  position: relative;
  background: linear-gradient(#c8e2cc, #98d5da);
  overflow: hidden;
`;
const BlackCurtain = styled.div<BlackCurtainProps>`
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${({ $isShown }) => ($isShown ? '4' : '-2')};
  background-color: black;
  opacity: ${({ $isShown }) => ($isShown ? '0.5' : '0')};
  transition: opacity 1s ease;
`;
const InvisibleCurtain = styled(BlackCurtain)`
  opacity: 0;
`;

type CityWrapperProps = {
  $isTouring: boolean;
};

const CityWrapper = styled.div<CityWrapperProps>`
  width: 100vw;
  height: 100vh;
  overflow: ${({ $isTouring }) => ($isTouring ? 'hidden' : 'scroll')};
  overflow-x: ${({ $isTouring }) => ($isTouring ? 'hidden' : 'scroll')};
  overflow-y: ${({ $isTouring }) => ($isTouring ? 'hidden' : 'scroll')};
  /* overflow: scroll; */

  &::-webkit-scrollbar {
    display: none;
  }
`;
