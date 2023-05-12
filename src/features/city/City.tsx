import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import character_green from '../../assets/character_green.png';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RENDER_CITY, SET_SCALE } from '../../redux/reducers/citySlice';
import { citySetting, mainLabel } from '../../utils/gameSettings';
import { HouseCityHall } from './housesSvg/HouseCityHall';
import { HouseGround } from './housesSvg/HouseGround';
import { HouseOfPlants } from './housesSvg/HouseOfPlants';
import useControlMayor from './hooks/useControlMayor';
import useDisplayCitizen from './hooks/useDisplayCitizen';
import useGridDrag from './hooks/useGridDrag';
import useHouseDrag from './hooks/useHouseDrag';
// import { House } from './House';

export const City: React.FC = () => {
  const {
    gridGap,
    gridLength,
    houseWidth,
    cityPaddingX,
    cityPaddingY,
    mayorWidth,
    mayorHeight,
  } = citySetting;
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
  const cityWidth = (gridLength + gridGap) * housesPosition[0].length;
  const cityHeight = (gridLength + gridGap) * housesPosition.length;

  useDisplayCitizen();

  useEffect(() => {
    dispatch(SET_SCALE(1));
  }, []);

  useEffect(() => {
    dispatch(RENDER_CITY(cityBasicInfo));
  }, [cityBasicInfo, dispatch]);

  const { mayorImgX, mayorImgY } = useControlMayor();

  const { handleGridLeave, handleGridOver, handleGridDrop } = useGridDrag({
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
      mainLabel.find((label) => label.name === houseType)?.houseComponent ||
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
      {housesPosition.map((row, yIndex) => {
        return (
          <Row
            key={yIndex}
            $paddingTopAttrs={`${gridGap * scale}px`}
            $gapAttrs={`${gridGap * scale}px`}
          >
            {row.map((house, xIndex) => (
              <Grid
                $lengthAttrs={`${gridLength * scale}px`}
                $status={gridsStatus[yIndex][xIndex]}
                $type={house.type}
                key={xIndex}
                onDragLeave={handleGridLeave}
                onDragOver={(event) => handleGridOver(event, xIndex, yIndex)}
                onDrop={() => handleGridDrop(xIndex, yIndex)}
              >
                {house.type !== '' && (
                  <>
                    <HouseGround houseType={house.type} />
                    {/* <House house={house} xIndex={xIndex} yIndex={yIndex} /> */}
                    <House
                      $lengthAttrs={`${houseWidth * scale}px`}
                      $fontSizeAttrs={`${24 * scale}px`}
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
        );
      })}
      {isTouring && (
        <CharacterWrap
          $widthAttrs={`${scale * mayorWidth}px`}
          $heightAttrs={`${scale * mayorHeight}px`}
        >
          <Character
            src={character_green}
            $xIndex={mayorImgX}
            $yIndex={mayorImgY}
            $scale={scale}
          />
        </CharacterWrap>
      )}
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
type RowProps = {
  $paddingTopAttrs: string;
  $gapAttrs: string;
};
type GridProps = {
  $lengthAttrs: string;
  $status: number;
  $type: string;
};
type HouseProps = {
  $lengthAttrs: string;
  $fontSizeAttrs: string;
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

const Row = styled.div.attrs<RowProps>(({ $paddingTopAttrs, $gapAttrs }) => ({
  style: {
    paddingTop: $paddingTopAttrs,
    gap: $gapAttrs,
  },
}))<RowProps>`
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
  background-color: ${({ $status, $type }) =>
    $status === 1
      ? 'lightgreen'
      : $status === -1
      ? 'lightcoral'
      : $type !== ''
      ? 'lightgrey'
      : ''};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const House = styled.div.attrs<HouseProps>(
  ({ $lengthAttrs, $fontSizeAttrs }) => ({
    style: {
      width: $lengthAttrs,
      height: $lengthAttrs,
      fontSize: $fontSizeAttrs,
    },
  })
)<HouseProps>`
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $isdraggable }) => ($isdraggable ? 'grab' : '')};
  &:active {
    cursor: grabbing;
  }
`;

type CharacterWrapProps = {
  $widthAttrs: string;
  $heightAttrs: string;
};

const enterCity = keyframes`
  0%{
    transform: scale(5) translateY(-50vh);
  }
  100%{
    transform: scale(1) translateY(0);
  }
`;

const CharacterWrap = styled.div.attrs<CharacterWrapProps>(
  ({ $heightAttrs, $widthAttrs }) => ({
    style: {
      width: $widthAttrs,
      height: $heightAttrs,
    },
  })
)<CharacterWrapProps>`
  position: fixed;
  top: calc(50vh - 25px);
  left: calc(50vw - 25px);
  overflow: hidden;
  z-index: 3;
  animation: ${enterCity} 4s 1;
`;
type CharacterProps = {
  $xIndex: number;
  $yIndex: number;
  $scale: number;
};
const Character = styled.img<CharacterProps>`
  height: 400%;
  position: relative;
  left: ${({ $xIndex, $scale }) => `${(-20 - 27 * $xIndex) * $scale}px`};
  top: ${({ $yIndex, $scale }) => `${-30 * $yIndex * $scale}px`};
`;
