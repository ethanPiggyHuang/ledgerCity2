import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import Footer from '../../component/Footer';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  END_CITY_SHIFT,
  TOGGLE_HOUSE_ADDING_MODE,
} from '../../redux/reducers/citySlice';
import {
  CONTROL_PANEL_DISPLAYED,
  SWITCH_SECTION_FOCUSED,
} from '../../redux/reducers/pageControlSlice';
import { City } from '../City/City';
import { OperationPanel } from '../../component/OperationPanel';
import { Ledger } from '../Ledger/Ledger';
import { CooperatorTrace } from '../Profile/CooperatorTrace';
import { Profile } from '../Profile/Profile';
import { Social } from '../Social/Social';
import { Statistics } from '../Xtatistics/Statistics';
import useSubscribeCity from './hooks/useSubscribeCity';
import useSubscribeActivity from './hooks/useSubscribeActivity';

export const Main: React.FC = () => {
  const { userId, cityList } = useAppSelector((state) => state.userInfo.data);
  const { pageActivity, panelOpened } = useAppSelector(
    (state) => state.pageControl
  );
  const { cityScrollShift, isCityScrollable, isTouring } = useAppSelector(
    (state) => state.city
  );
  const cityRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  useSubscribeCity(cityList);
  useSubscribeActivity(userId);

  // 監聽使用者進入頁面 -> 送到 db
  useEffect(() => {
    if (userId) {
      dispatch(SWITCH_SECTION_FOCUSED({ userId, pageActivity: 'city' }));
    }
  }, [userId]);

  useEffect(() => {
    if (isCityScrollable) {
      cityRef.current?.scrollTo({
        top: cityScrollShift.y,
        left: cityScrollShift.x,
        behavior: 'smooth',
      });
      dispatch(END_CITY_SHIFT());
    }
  }, [isCityScrollable]);

  return (
    <Wrapper>
      <Profile />
      <CityWrapper
        $isTouring={isTouring}
        onClick={() => {
          if (panelOpened !== 'none') {
            dispatch(CONTROL_PANEL_DISPLAYED('none'));
          }
        }}
        ref={cityRef}
      >
        <City />
      </CityWrapper>
      <OperationPanel props={cityRef.current} />
      <CooperatorTrace />
      <Mask
        $isShown={['statistics', 'profile', 'ledger'].includes(pageActivity)}
        $invisible={pageActivity === 'ledger'}
        onClick={() => {
          console.log('hi');
          dispatch(SWITCH_SECTION_FOCUSED({ userId, pageActivity: 'city' }));
          dispatch(CONTROL_PANEL_DISPLAYED('none'));
          dispatch(TOGGLE_HOUSE_ADDING_MODE(false));
        }}
      />
      <Ledger />
      <Statistics />
      <Social />
      <Footer />
    </Wrapper>
  );
};

type MaskProps = {
  $isShown: boolean;
  $invisible: boolean;
};

const Wrapper = styled.div`
  height: 100vh;
  position: relative;
  background: linear-gradient(#c8e2cc, #98d5da);
  overflow: hidden;
`;
const Mask = styled.div<MaskProps>`
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${({ $isShown }) => ($isShown ? '4' : '-2')};
  background-color: ${({ $invisible }) =>
    $invisible ? 'rgba(0,0,0,0)' : 'rgb(0,0,0)'};
  opacity: ${({ $isShown }) => ($isShown ? '0.5' : '0')};
  transition: opacity 1s ease;
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

  &::-webkit-scrollbar {
    display: none;
  }
`;
