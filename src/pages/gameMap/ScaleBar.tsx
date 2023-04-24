import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  ADJUST_SCALE,
  SET_SCALE,
  SET_CITY_LOCATION,
} from '../../redux/reducers/cityArrangementSlice';
import { gridGap, gridLength } from '../../utils/gameSettings';

export const ScaleBar: React.FC = () => {
  const { scale } = useAppSelector((state) => state.cityArrangement);
  // const { currentPage } = useAppSelector(
  //   (state) => state.userActivity.data.myCPVIkcOYalDVvdj9hngfml3yq2
  // );
  const dispatch = useAppDispatch();
  const { housesPosition } = useAppSelector((state) => state.cityArrangement);
  const cityHeight = (gridLength + gridGap) * housesPosition.length;
  const [displayScale, setDisplayScale] = useState(true); // TODO: 要放進 redux state？
  const [isScrolling, setIsScrolling] = useState(false); // TODO: 滾動時才出現「倍率」

  useEffect(() => {
    const scrollEvent = (event: WheelEvent) => {
      // TODO: 要限定在 city 才 listen 此 scroll event
      // if (currentPage === 'city') {
      event.preventDefault();
      const wheel = event.deltaY / 3000;
      const zoom = Math.pow(1 + Math.abs(wheel) / 2, wheel > 0 ? 1 : -1);
      setTimeout(() => dispatch(ADJUST_SCALE(zoom)), 10);
      // }
    };
    window.addEventListener('wheel', scrollEvent, {
      passive: false,
    });

    return () => window.removeEventListener('wheel', scrollEvent);
  }, []);

  // 會發生 Maximum update depth exceeded. Q^Q
  // useEffect(() => {
  //   setDisplayScale(true);
  //   // TODO: 還需要搭配 isScrolling 才能有較好體驗，在 scroll event 中觸發
  //   setTimeout(() => setDisplayScale(false), 8000);
  // }, [scale]);

  return (
    <Wrapper>
      {displayScale && <Scale>{`${scale.toFixed(1)} x`}</Scale>}
      <button onClick={() => dispatch(SET_SCALE(1))}>1.0 x</button>
      <button onClick={() => dispatch(SET_SCALE(2))}>2.0 x</button>
      <button onClick={() => dispatch(SET_CITY_LOCATION({ top: 0, left: 0 }))}>
        左上
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 20px;
  right: 20px;
  width: 150px;
`;

const Scale = styled.p`
  width: 150px;
  height: 40px;
  background-color: grey;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;
