import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import useSound from 'use-sound';
import character_green from '../../assets/character_green.png';
import hammer_ice from '../../assets/hammer_ice.wav';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  DRAG_HOUSE_START,
  DROP_HOUSE,
  RENDER_CITY,
  SET_SCALE,
  SHIFT_CITY_VIA_KEYBOARD,
  SWITCH_GRID_LIGHT_OFF,
  SWITCH_GRID_LIGHT_ON,
} from '../../redux/reducers/citySlice';
import { citySetting } from '../../utils/gameSettings';
import { HouseCityHall } from './housesSvg/HouseCityHall';
import { HouseGrid } from './housesSvg/HouseGrid';
import { HouseOfClothes } from './housesSvg/HouseOfClothes';
import { HouseOfDrinks } from './housesSvg/HouseOfDrinks';
import { HouseOfFood } from './housesSvg/HouseOfFood';
import { HouseOfPlants } from './housesSvg/HouseOfPlants';

export const City: React.FC = () => {
  const { gridGap, gridLength, houseWidth, cityPaddingX, cityPaddingY } =
    citySetting;
  const cityBasicInfo = useAppSelector((state) => state.city.basicInfo);
  const {
    housesPosition,
    gridsStatus,
    dragMode,
    scale,
    cityKeyShift,
    isTouring,
    isAddingNewHouse: isAddingNew,
  } = useAppSelector((state) => state.city);
  const dispatch = useAppDispatch();
  const cityWidth = (gridLength + gridGap) * housesPosition[0].length;
  const cityHeight = (gridLength + gridGap) * housesPosition.length;
  const [figurePosition, setFigurePosition] = useState(0);
  const [greenMoveX, setGreenMoveX] = useState(0);
  const [greenMoveY, setGreenMoveY] = useState(0);

  const [playHammerShort] = useSound(hammer_ice, { volume: 0.5 });

  useEffect(() => {
    const handlePosition = () => {
      setFigurePosition((prev) => prev + 30);
    };
    const interval = setInterval(handlePosition, 2000);
    const timeout = setTimeout(() => clearInterval(interval), 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    dispatch(SET_SCALE(1));
  }, []);

  useEffect(() => {
    dispatch(RENDER_CITY(cityBasicInfo));
  }, [cityBasicInfo, dispatch]);

  useEffect(() => {
    const handelKeypress = (event: KeyboardEvent) => {
      if (event.code === 'ArrowDown') {
        event.preventDefault();
        dispatch(SHIFT_CITY_VIA_KEYBOARD({ deltaX: 0, deltaY: 15 }));
        setGreenMoveY(0);
        setGreenMoveX((prev) => (prev + 1) % 3);
      }
      if (event.code === 'ArrowUp') {
        event.preventDefault();
        dispatch(SHIFT_CITY_VIA_KEYBOARD({ deltaX: 0, deltaY: -15 }));
        setGreenMoveY(1);
        setGreenMoveX((prev) => (prev + 1) % 3);
      }
      if (event.code === 'ArrowRight') {
        event.preventDefault();
        dispatch(SHIFT_CITY_VIA_KEYBOARD({ deltaX: 15, deltaY: 0 }));
        setGreenMoveY(3);
        setGreenMoveX((prev) => (prev + 1) % 3);
      }
      if (event.code === 'ArrowLeft') {
        event.preventDefault();
        dispatch(SHIFT_CITY_VIA_KEYBOARD({ deltaX: -15, deltaY: 0 }));
        setGreenMoveY(2);
        setGreenMoveX((prev) => (prev + 1) % 3);
      }
    };

    if (isTouring) {
      window.addEventListener('keydown', handelKeypress);
    } else {
      window.removeEventListener('keydown', handelKeypress);
    }
    return () => {
      window.removeEventListener('keydown', handelKeypress);
    };
  }, [isTouring]);

  return (
    <CityRange
      $widthAttrs={`${cityWidth * scale + 2 * cityPaddingX}px`}
      $heightAttrs={`${cityHeight * scale + 2 * cityPaddingY}px`}
      $topAttrs={`${cityKeyShift.y}px`}
      $leftAttrs={`${cityKeyShift.x}px`}
      $paddingX={cityPaddingX}
      $paddingY={cityPaddingY}
      $relocatMode={isAddingNew ? 'newHouse' : 'others'}
    >
      {isTouring && (
        <CharacterWrap
          $widthAttrs={`${scale * 26}px`}
          $heightAttrs={`${scale * 30}px`}
        >
          <Character
            src={character_green}
            $xIndex={greenMoveX}
            $yIndex={greenMoveY}
            $scale={scale}
          />
        </CharacterWrap>
      )}

      {housesPosition.map((row, yIndex) => {
        return (
          <Row
            key={yIndex}
            $paddingTopAttrs={`${gridGap * scale}px`}
            $gapAttrs={`${gridGap * scale}px`}
          >
            {row.map((house, xIndex) => {
              return (
                <Grid
                  $lengthAttrs={`${gridLength * scale}px`}
                  $status={gridsStatus[yIndex][xIndex]}
                  $type={house.type}
                  key={xIndex}
                  onDragLeave={(e) => {
                    if (dragMode !== 'houses') return;
                    dispatch(SWITCH_GRID_LIGHT_OFF());
                  }}
                  onDragOver={(e) => {
                    if (dragMode !== 'houses') return;
                    e.preventDefault();
                    dispatch(SWITCH_GRID_LIGHT_ON({ xIndex, yIndex }));
                  }}
                  onDrop={(e) => {
                    if (dragMode !== 'houses') return;
                    dispatch(DROP_HOUSE({ xIndex, yIndex }));
                    if (gridsStatus[yIndex][xIndex] === 1) {
                      playHammerShort();
                      setTimeout(() => playHammerShort(), 500);
                      setTimeout(() => playHammerShort(), 1000);
                    }
                  }}
                >
                  {house.type !== '' && (
                    <>
                      <HouseGrid houseType={house.type} />
                      <House
                        $lengthAttrs={`${houseWidth * scale}px`}
                        $fontSizeAttrs={`${24 * scale}px`}
                        $isdraggable={dragMode === 'houses'}
                        draggable={dragMode === 'houses'}
                        onDragStart={(event: React.DragEvent) => {
                          if (dragMode !== 'houses') return;
                          const target = event.target as HTMLDivElement;
                          target.style.opacity = '0.01';
                          dispatch(
                            DRAG_HOUSE_START({
                              id: house.id,
                              target: house.type,
                              pastIndex: { xIndex, yIndex },
                            })
                          );
                        }}
                        onDragEnd={(event: React.DragEvent) => {
                          if (dragMode !== 'houses') return;
                          const target = event.target as HTMLDivElement;
                          target.style.opacity = '1';
                        }}
                      >
                        {house.type === '食物' ? (
                          <HouseOfFood />
                        ) : house.type === '服裝' ? (
                          <HouseOfClothes />
                        ) : house.type === '飲品' ? (
                          <HouseOfDrinks />
                        ) : house.type === '市政廳' ? (
                          <HouseCityHall />
                        ) : (
                          <HouseOfPlants />
                        )}
                      </House>
                    </>
                  )}
                </Grid>
              );
            })}
          </Row>
        );
      })}
    </CityRange>
  );
};

type CityRangeProps = {
  $widthAttrs: string;
  $heightAttrs: string;
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
  ({ $widthAttrs, $heightAttrs, $topAttrs, $leftAttrs }) => ({
    style: {
      width: $widthAttrs,
      height: $heightAttrs,
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
