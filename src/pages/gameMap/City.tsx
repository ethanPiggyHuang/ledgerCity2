import React, { useEffect } from 'react';
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

export const City: React.FC = () => {
  const { gridGap, gridLength, houseWidth, cityPadding } = citySetting;
  const cityBasicInfo = useAppSelector((state) => state.cityBasicInfo);
  const { housesPosition, gridsStatus, dragMode, scale, cityShift } =
    useAppSelector((state) => state.cityArrangement);
  const dispatch = useAppDispatch();
  // TODO: 要再改成可以一鍵看到城市全貌
  const cityWidth = (gridLength + gridGap) * housesPosition[0].length;
  const cityHeight = (gridLength + gridGap) * housesPosition.length;

  const [playHammerShort] = useSound(hammer_ice, { volume: 0.5 });

  // console.log('top', cityShift.current.y, 'left', cityShift.current.x);

  useEffect(() => {
    dispatch(displayCity(cityBasicInfo));
  }, [cityBasicInfo, dispatch]);

  return (
    <CityRange
      $widthAttrs={`${cityWidth * scale + 2 * cityPadding}px`}
      $heightAttrs={`${cityHeight * scale + 2 * cityPadding}px`}
      $topAttrs={`${cityShift.current.y}px`}
      $leftAttrs={`${cityShift.current.x}px`}
      $padding={cityPadding}
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
  padding: ${({ $padding }) => `${$padding}px`};
  /* position: absolute; */
  /* cursor: pointer; */
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
`;
