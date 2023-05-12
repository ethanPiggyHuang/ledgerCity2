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
  const { gridLength, cityPaddingX, cityPaddingY } = citySetting;
  const cityWidth = gridLength * housesPosition[0].length;
  const cityHeight = gridLength * housesPosition.length;

  useEffect(() => {
    dispatch(SET_SCALE(1));
  }, []);

  useEffect(() => {
    dispatch(RENDER_CITY(cityBasicInfo));
  }, [cityBasicInfo, dispatch]);

  return (
    <CityRange
      $width={cityWidth * scale + 2 * cityPaddingX}
      $height={cityHeight * scale + 2 * cityPaddingY}
      $topAttrs={`${cityKeyShift.y}px`}
      $leftAttrs={`${cityKeyShift.x}px`}
      $paddingX={cityPaddingX}
      $paddingY={cityPaddingY}
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
  $width: number;
  $height: number;
  $topAttrs: string;
  $leftAttrs: string;
  $paddingX: number;
  $paddingY: number;
  $relocatMode: string;
};

const CityRange = styled.div.attrs<CityRangeProps>(
  ({ $topAttrs, $leftAttrs }) => ({
    style: {
      top: $topAttrs,
      left: $leftAttrs,
    },
  })
)<CityRangeProps>`
  margin: auto;
  flex-wrap: wrap;
  height: fit-content;
  padding: ${({ $paddingX, $paddingY }) => `${$paddingY}px ${$paddingX}px`};
  position: relative;
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $height }) => `${$height}px`};
  transition: ${({ $relocatMode }) =>
    $relocatMode === 'newHouse'
      ? 'top 1s ease, left 1s ease'
      : 'top 0.1s ease, left 0.1s ease'};
`;
