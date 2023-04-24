import React, { useRef } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { CITY_RELOCATE } from '../../redux/reducers/cityArrangementSlice';

export const CityShiftControl = (props: { type: string }) => {
  const { dragMode } = useAppSelector((state) => state.cityArrangement);
  const dispatch = useAppDispatch();
  const interval: any = useRef();
  // const hasLeftAttrs:boolean = props==='left' || props false

  // useEffect(() => {
  //   const handleHover = () => {
  //     dispatch(
  //       CITY_RELOCATE({
  //         shiftX: 0,
  //         shiftY: 1,
  //       })
  //     );
  //   };
  //   window.addEventListener('mouseenter');
  // }, []);

  const down = () => {
    dispatch(
      CITY_RELOCATE({
        shiftX: 0,
        shiftY: 1,
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
      down
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
  width: 100vw;
  position: absolute;
  background-color: grey;
  opacity: 0.5;
  top: 0;
  cursor: pointer;
  z-index: 2;
`;
