import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RENDER_CITY, SET_SCALE } from '../../redux/reducers/citySlice';
import { citySetting, mainLabel, gridColor } from '../../utils/gameSettings';
import { HouseCityHall } from './housesSvg/HouseCityHall';
import { HouseGround } from './housesSvg/HouseGround';
import { HouseOfPlants } from './housesSvg/HouseOfPlants';
import useGridDrag from './hooks/useGridDrag';
import useHouseDrag from './hooks/useHouseDrag';
import { WalkingMayor } from './WalkingMayor';

export const City: React.FC = () => {
  const { gridLength, houseWidth, cityPaddingX, cityPaddingY } = citySetting;
  const cityBasicInfo = useAppSelector((state) => state.city.basicInfo);
  const {
    housesPosition,
    gridsStatus,
    dragMode,
    scale,
    cityKeyShift,
    isTouring,
    isAddingNewHouse,
  } = useAppSelector((state) => state.city);
  const dispatch = useAppDispatch();
  const cityWidth = gridLength * housesPosition[0].length;
  const cityHeight = gridLength * housesPosition.length;

  useEffect(() => {
    dispatch(SET_SCALE(1));
  }, []);

  useEffect(() => {
    dispatch(RENDER_CITY(cityBasicInfo));
  }, [cityBasicInfo, dispatch]);

  const { handleGridDragLeave, handleGridDragOver, handleGridDrop } =
    useGridDrag({
      dragMode,
      dispatch,
      gridsStatus,
    });

  const { handleHouseDragStart, handleHouseDragEnd } = useHouseDrag({
    dragMode,
    dispatch,
  });

  const renderHouse = (houseType: string) => {
    if (houseType === '市政廳') return <HouseCityHall />;
    const HouseComponent =
      mainLabel.find((label) => label.name === houseType)?.houseComponent ??
      HouseOfPlants;
    return <HouseComponent />;
  };

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
        <Row key={yIndex}>
          {row.map((house, xIndex) => (
            <Grid
              $lengthAttrs={`${gridLength * scale}px`}
              $backgroundColor={gridColor[gridsStatus[yIndex][xIndex]]}
              key={xIndex}
              onDragLeave={handleGridDragLeave}
              onDragOver={(event) => handleGridDragOver(event, xIndex, yIndex)}
              onDrop={() => handleGridDrop(xIndex, yIndex)}
            >
              {house.type !== '' && (
                <>
                  <HouseGround houseType={house.type} />
                  <House
                    $lengthAttrs={`${houseWidth * scale}px`}
                    $isdraggable={dragMode === 'houses'}
                    draggable={dragMode === 'houses'}
                    onDragStart={(event) =>
                      handleHouseDragStart(event, house, xIndex, yIndex)
                    }
                    onDragEnd={(event) => handleHouseDragEnd(event)}
                  >
                    {renderHouse(house.type)}
                  </House>
                </>
              )}
            </Grid>
          ))}
        </Row>
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

type GridProps = {
  $lengthAttrs: string;
  $backgroundColor: 'lightgreen' | 'lightcarol' | '';
};
type HouseProps = {
  $lengthAttrs: string;
  $isdraggable: boolean;
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

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Grid = styled.div.attrs<GridProps>(({ $lengthAttrs }) => ({
  style: {
    width: $lengthAttrs,
    height: $lengthAttrs,
  },
}))<GridProps>`
  position: relative;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const House = styled.div.attrs<HouseProps>(({ $lengthAttrs }) => ({
  style: {
    width: $lengthAttrs,
    height: $lengthAttrs,
  },
}))<HouseProps>`
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $isdraggable }) => ($isdraggable ? 'grab' : '')};
  &:active {
    cursor: grabbing;
  }
`;
