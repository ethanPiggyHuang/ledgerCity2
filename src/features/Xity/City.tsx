import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RENDER_CITY, SET_SCALE } from '../../redux/reducers/citySlice';
import { citySetting } from '../../utils/gameSettings';
import { WalkingMayor } from './WalkingMayor';
import { GridRow } from './GridRow';

export const City: React.FC = () => {
  const dispatch = useAppDispatch();
  const cityBasicInfo = useAppSelector((state) => state.city.basicInfo);
  const { housesPosition, scale, cityKeyShift, isTouring, isAddingNewHouse } =
    useAppSelector((state) => state.city);
  const { gridLength, cityPadding } = citySetting;
  const citySize = {
    width: gridLength * housesPosition[0].length * scale + 2 * cityPadding.x,
    height: gridLength * housesPosition.length * scale + 2 * cityPadding.y,
  };
  // const cityWidth =
  // const cityHeight = gridLength * housesPosition.length;

  useEffect(() => {
    dispatch(SET_SCALE(1));
  }, []);

  useEffect(() => {
    dispatch(RENDER_CITY(cityBasicInfo));
  }, [cityBasicInfo, dispatch]);

  return (
    <CityRange
      $size={citySize}
      $shiftAttrs={{ top: `${cityKeyShift.y}px`, left: `${cityKeyShift.x}px` }}
      $padding={cityPadding}
      $relocatMode={isAddingNewHouse ? 'newHouse' : 'others'}
    >
      {housesPosition.map((row, yIndex) => (
        <GridRow key={yIndex} row={row} yIndex={yIndex} />
      ))}
      {isTouring && <WalkingMayor />}
    </CityRange>
  );
};

type CityRangeProps = {
  $size: { width: number; height: number };
  $shiftAttrs: { top: string; left: string };
  $padding: { x: number; y: number };
  $relocatMode: string;
};

const CityRange = styled.div.attrs<CityRangeProps>(({ $shiftAttrs }) => ({
  style: {
    top: $shiftAttrs.top,
    left: $shiftAttrs.left,
  },
}))<CityRangeProps>`
  margin: auto;
  flex-wrap: wrap;
  height: fit-content;
  padding: ${({ $padding }) => `${$padding.y}px ${$padding.x}px`};
  position: relative;
  width: ${({ $size }) => `${$size.width}px`};
  height: ${({ $size }) => `${$size.height}px`};
  transition: ${({ $relocatMode }) =>
    $relocatMode === 'newHouse'
      ? 'top 1s ease, left 1s ease'
      : 'top 0.1s ease, left 0.1s ease'};
`;
