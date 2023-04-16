import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { ADJUST_SCALE } from '../../redux/reducers/cityArrangementSlice';

export const ScaleBar: React.FC = () => {
  const { scale } = useAppSelector((state) => state.cityArrangement);
  const { currentPage } = useAppSelector(
    (state) => state.userActivity.data.myCPVIkcOYalDVvdj9hngfml3yq2
  );
  const dispatch = useAppDispatch();
  const [displayScale, setDisplayScale] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false); // TODO

  useEffect(() => {
    const scrollEvent = (event: WheelEvent) => {
      // TODO: 要限定在 city 才 listen 此 scroll event
      if (currentPage === 'city') {
        event.preventDefault();
        const wheel = event.deltaY / 3000;
        const zoom = Math.pow(1 + Math.abs(wheel) / 2, wheel > 0 ? 1 : -1);
        setTimeout(() => dispatch(ADJUST_SCALE(zoom)), 10);
      }
    };
    window.addEventListener('wheel', (event) => scrollEvent(event), {
      passive: false,
    });

    return () =>
      //TODO 在別的頁面時，也要 remove EventListener
      window.removeEventListener('wheel', (event) => scrollEvent(event));
  }, []);

  useEffect(() => {
    setDisplayScale(true);
    // TODO: 還需要搭配 isScrolling 才能有較好體驗，在 scroll event 中觸發
    setTimeout(() => setDisplayScale(false), 8000);
  }, [scale]);

  return (
    <Wrapper>
      {displayScale && <Scale>{`${scale.toFixed(1)} x`}</Scale>}
      <button onClick={() => {}}>to 1.0 x</button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 20px;
  right: 20px;
`;

const Scale = styled.p`
  width: 150px;
  height: 50px;
  background-color: grey;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;
