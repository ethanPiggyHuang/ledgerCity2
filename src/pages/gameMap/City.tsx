import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  displayCity,
  dropHouse,
  dragHouseStart,
  dragLightOn,
  dragLightOff,
  RECORD_DRAG_START,
  UPDATE_CITY_LOCATION,
  CITY_WHEEL_SHIFT,
  SET_SCALE,
} from '../../redux/reducers/cityArrangementSlice';
import { citySetting } from '../../utils/gameSettings';
import hammer_ice from '../../assets/hammer_ice.wav';
import { HouseOfFood } from './housesSvg/HouseOfFood';
import { HouseOfClothes } from './housesSvg/HouseOfClothes';
import { HouseOfDrinks } from './housesSvg/HouseOfDrinks';
import { HouseOfPlants } from './housesSvg/HouseOfPlants';
import { HouseGrid } from './housesSvg/HouseGrid';
import mapPin from '../../assets/mapPin.png';
import character_green from '../../assets/character_green.png';

export const City: React.FC = () => {
  const { gridGap, gridLength, houseWidth, cityPaddingX, cityPaddingY } =
    citySetting;
  const cityBasicInfo = useAppSelector((state) => state.cityBasicInfo);
  const { housesPosition, gridsStatus, dragMode, scale, cityWheelShift } =
    useAppSelector((state) => state.cityArrangement);
  const { pageActivity } = useAppSelector((state) => state.pageControl);
  const dispatch = useAppDispatch();
  // TODO: 要再改成可以一鍵看到城市全貌?
  const cityWidth = (gridLength + gridGap) * housesPosition[0].length;
  const cityHeight = (gridLength + gridGap) * housesPosition.length;
  const [figurePosition, setFigurePosition] = useState(0);
  const [cityX, setCityX] = useState(0);
  const [cityY, setCityY] = useState(0);
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
    dispatch(displayCity(cityBasicInfo));
  }, [cityBasicInfo, dispatch]);

  useEffect(() => {
    const handelWheel = (event: WheelEvent) => {
      setTimeout(
        () =>
          dispatch(
            CITY_WHEEL_SHIFT({
              deltaX: event.deltaX / 10,
              deltaY: event.deltaY / 10,
            })
          ),
        1
      );
      // setCityX((prev) => prev - event.deltaX / 10);
      // setCityY((prev) => prev - event.deltaY / 10);
    };
    if (pageActivity === 'city') {
      window.addEventListener('wheel', handelWheel);
    } else {
      window.removeEventListener('wheel', handelWheel);
    }
    return () => window.removeEventListener('wheel', handelWheel);
  }, [pageActivity]);

  // useEffect(() => {
  //   const handelClick = (event: any) => {
  //     setCityX(-300);
  //     setCityY(-300);
  //   };
  //   window.addEventListener('click', handelClick);
  //   return () => window.removeEventListener('click', handelClick);
  // }, []);

  useEffect(() => {
    const handelKeypress = (event: any) => {
      if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        dispatch(CITY_WHEEL_SHIFT({ deltaX: 0, deltaY: 15 }));
        // setCityY((prev) => prev - 5);
        setGreenMoveY(0);
        setGreenMoveX((prev) => (prev + 1) % 3);
      }
      if (event.code === 'ArrowUp' || event.code === 'KeyW') {
        dispatch(CITY_WHEEL_SHIFT({ deltaX: 0, deltaY: -15 }));
        // setCityY((prev) => prev + 5);
        setGreenMoveY(1);
        setGreenMoveX((prev) => (prev + 1) % 3);
      }
      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        dispatch(CITY_WHEEL_SHIFT({ deltaX: 15, deltaY: 0 }));
        // setCityX((prev) => prev - 5);
        setGreenMoveY(3);
        setGreenMoveX((prev) => (prev + 1) % 3);
      }
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        dispatch(CITY_WHEEL_SHIFT({ deltaX: -15, deltaY: 0 }));
        // setCityX((prev) => prev + 5);
        setGreenMoveY(2);
        setGreenMoveX((prev) => (prev + 1) % 3);
      }
    };
    window.addEventListener('keydown', handelKeypress);
    return () => window.removeEventListener('keydown', handelKeypress);
  }, []);

  return (
    <CityRange
      $widthAttrs={`${cityWidth * scale + 2 * cityPaddingX}px`}
      $heightAttrs={`${cityHeight * scale + 2 * cityPaddingY}px`}
      $topAttrs={`${cityWheelShift.y}px`}
      $leftAttrs={`${cityWheelShift.x}px`}
      $padding={cityPaddingY}
      $relocatMode={'newHouse'}

      // draggable={dragMode === 'city'}
      // onDragStart={(event: React.DragEvent) => {
      //   if (dragMode !== 'city') return;
      //   const target = event.target as HTMLDivElement;
      //   event.dataTransfer.setData('text/plain', '');
      //   dispatch(
      //     RECORD_DRAG_START({ mouseX: event.clientX, mouseY: event.clientY })
      //   );
      //   target.style.opacity = '0.01';
      // }}
      // onDragEnd={(event: React.DragEvent) => {
      //   if (dragMode !== 'city') return;
      //   const target = event.target as HTMLDivElement;
      //   target.style.opacity = '1';
      //   dispatch(
      //     UPDATE_CITY_LOCATION({
      //       mouseX: event.clientX,
      //       mouseY: event.clientY,
      //     })
      //   );
      // }}
    >
      {/* <WalkingFigure src={mapPin} $scale={scale} $left={figurePosition} />
      <WalkingFigure src={mapPin} $scale={scale} $left={figurePosition * 2} /> */}
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
                  // ref={testRef}
                  // onDragEnter={(e) => {
                  // }}
                  onDragLeave={(e) => {
                    if (dragMode !== 'houses') return;
                    dispatch(dragLightOff());
                  }}
                  onDragOver={(e) => {
                    if (dragMode !== 'houses') return;
                    e.preventDefault();
                    dispatch(dragLightOn({ xIndex, yIndex }));
                  }}
                  onDrop={(e) => {
                    if (dragMode !== 'houses') return;
                    dispatch(dropHouse({ xIndex, yIndex }));
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
                            dragHouseStart({
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
  $padding: number;
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
  padding: ${({ $padding }) => `${$padding}px ${2 * $padding}px`};
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
  /* border: 1px blue solid; */
`;

const Grid = styled.div.attrs<GridProps>(({ $lengthAttrs }) => ({
  style: {
    width: $lengthAttrs,
    height: $lengthAttrs,
  },
}))<GridProps>`
  /* border: 1px solid lightblue; */
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

type WalkingFigureProps = {
  $scale: number;
  $left: number;
};

const WalkingFigure = styled.img<WalkingFigureProps>`
  height: ${({ $scale }) => `${$scale * 20}px`};
  position: absolute;
  left: ${({ $scale, $left }) => `${$left * $scale + 400}px`};
  transition: left 0.5s linear;
  z-index: 3;
`;

type CharacterWrapProps = {
  $widthAttrs: string;
  $heightAttrs: string;
};

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
  /* width: 52px; */
  /* height: 60px; */
  overflow: hidden;
  /* border: black 1px solid; */
  z-index: 3;
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
