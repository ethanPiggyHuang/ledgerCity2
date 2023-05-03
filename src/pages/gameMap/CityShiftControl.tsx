import React, { useRef } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  CITY_RELOCATE,
  CITY_WHEEL_SHIFT,
} from '../../redux/reducers/cityArrangementSlice';

export const CityShiftControl = (props: { type: string }) => {
  const { dragMode } = useAppSelector((state) => state.cityArrangement);
  const dispatch = useAppDispatch();
  const interval: any = useRef();

  const type = {
    left: { deltaX: -2, deltaY: 0 },
  };

  const down = () => {
    dispatch(
      CITY_WHEEL_SHIFT({
        deltaX: -2,
        deltaY: 0,
      })
    );
  };

  return (
    <Control
      onMouseEnter={() => {
        if (dragMode !== 'city') return;
        interval.current = setInterval(down, 50);
      }}
      onMouseLeave={() => {
        if (dragMode !== 'city') return;
        clearInterval(interval.current);
      }}
    >
      {props.type}
    </Control>
  );
};

// type CityRangeProps = {
//   $widthAttrs: string;
//   $heightAttrs: string;
//   $topAttrs: string;
//   $leftAttrs: string;
// };

const Control = styled.div`
  width: 50px;
  height: 100vh;
  position: absolute;
  background-color: grey;
  opacity: 0.5;
  top: 0;
  /* left: 5px; */
  cursor: pointer;
  z-index: 2;
`;
