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
  const { housesPosition, gridsStatus, dragMode, scale, cityShift } =
    useAppSelector((state) => state.cityArrangement);
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
    dispatch(displayCity(cityBasicInfo));
  }, [cityBasicInfo, dispatch]);

  useEffect(() => {
    const handelScroll = (event: any) => {
      setCityX((prev) => prev + event.deltaX / 10);
      setCityY((prev) => prev + event.deltaY / 10);
      // setTimeout(() => setCityX((prev) => prev + event.deltaX / 10), 20);
      // setTimeout(() => setCityY((prev) => prev + event.deltaY / 10), 20);
    };
    window.addEventListener('wheel', handelScroll);
    return () => window.removeEventListener('wheel', handelScroll);
  }, []);

  useEffect(() => {
    const handelClick = (event: any) => {
      setCityX(-300);
      setCityY(-300);
    };
    window.addEventListener('click', handelClick);
    return () => window.removeEventListener('click', handelClick);
  }, []);

  useEffect(() => {
    const handelKeypress = (event: any) => {
      if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        setCityY((prev) => prev - 5);
        setGreenMoveY(0);
        setGreenMoveX((prev) => (prev + 1) % 3);
      }
      if (event.code === 'ArrowUp' || event.code === 'KeyW') {
        setCityY((prev) => prev + 5);
        setGreenMoveY(1);
        setGreenMoveX((prev) => (prev + 1) % 3);
      }
      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        setCityX((prev) => prev - 5);
        setGreenMoveY(3);
        setGreenMoveX((prev) => (prev + 1) % 3);
      }
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        setCityX((prev) => prev + 5);
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
      $topAttrs={`${cityY}px`}
      $leftAttrs={`${cityX}px`}
      $padding={cityPaddingY}
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
      <WalkingFigure src={mapPin} $scale={scale} $left={figurePosition} />
      <WalkingFigure src={mapPin} $scale={scale} $left={figurePosition * 2} />
      <CharacterWrap>
        <Character
          src={character_green}
          $xIndex={greenMoveX}
          $yIndex={greenMoveY}
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
  border: 1px blue solid;
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

const CharacterWrap = styled.div`
  position: fixed;
  top: calc(50vh - 25px);
  left: calc(50vw - 25px);
  width: 52px;
  height: 60px;
  overflow: hidden;
  /* border: black 1px solid; */
  z-index: 3;
`;
type CharacterProps = {
  $xIndex: number;
  $yIndex: number;
};
const Character = styled.img<CharacterProps>`
  height: 240px;
  position: relative;
  left: ${({ $xIndex }) => `${-40 - 54 * $xIndex}px`};
  top: ${({ $yIndex }) => `${-60 * $yIndex}px`};
`;
