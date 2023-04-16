import React, { useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  displayCity,
  dropHouse,
  dragHouseStart,
  dragLightOn,
  dragLightOff,
  ADJUST_SCALE,
} from '../../redux/reducers/cityArrangementSlice';

export const City: React.FC = () => {
  const cityBasicInfo = useAppSelector((state) => state.cityBasicInfo);
  const { housesPosition, gridsStatus, isHouseDraggable, scale } =
    useAppSelector((state) => state.cityArrangement);
  const dispatch = useAppDispatch();
  const wrapperWidth = 1200;
  const gap = 20;
  const gridlength = 120;

  console.log('scale', scale);

  useEffect(() => {
    dispatch(displayCity(cityBasicInfo));
  }, [cityBasicInfo, dispatch]);

  useEffect(() => {
    const scrollEvent = (event: WheelEvent) => {
      event.preventDefault();
      const wheel = event.deltaY / 3000;
      const zoom = Math.pow(1 + Math.abs(wheel) / 2, wheel > 0 ? 1 : -1);
      setTimeout(() => dispatch(ADJUST_SCALE(zoom)), 10);
      // setScale((prev) => prev * zoom), 10);
    };
    window.addEventListener('wheel', (event) => scrollEvent(event), {
      passive: false,
    });

    return () =>
      window.removeEventListener('wheel', (event) => scrollEvent(event));
  }, []);

  return (
    <>
      <CityRange $wrapperWidth={wrapperWidth} $gap={gap} $scale={scale}>
        {housesPosition.map((row, yIndex) => {
          return (
            <Row key={yIndex} $scale={scale}>
              {row.map((house, xIndex) => {
                return (
                  <Grid
                    $gridlength={gridlength}
                    $scale={scale}
                    $status={gridsStatus[yIndex][xIndex]}
                    key={xIndex}
                    // ref={testRef}
                    // onDragEnter={(e) => {
                    // }}
                    onDragLeave={(e) => dispatch(dragLightOff())}
                    onDragOver={(e) => {
                      e.preventDefault();
                      dispatch(dragLightOn({ xIndex, yIndex }));
                    }}
                    onDrop={(e) => {
                      dispatch(dropHouse({ xIndex, yIndex }));
                    }}
                  >
                    {house.type !== '' && (
                      <House
                        $scale={scale}
                        $type={house.type}
                        draggable={isHouseDraggable}
                        onDragStart={(event: React.DragEvent) => {
                          if (isHouseDraggable) {
                            const target = event.target as HTMLDivElement;
                            target.style.opacity = '0.01';
                            console.log(house.id, house.type);
                            dispatch(
                              dragHouseStart({
                                id: house.id,
                                target: house.type,
                                pastIndex: { xIndex, yIndex },
                              })
                            );
                          }
                        }}
                        onDragEnd={(event: React.DragEvent) => {
                          const target = event.target as HTMLDivElement;
                          target.style.opacity = '1';
                        }}
                      >
                        {house.type}
                      </House>
                    )}
                  </Grid>
                );
              })}
            </Row>
          );
        })}
      </CityRange>
    </>
  );
};

type CityRangeProps = {
  $wrapperWidth: number;
  $gap: number;
  $scale: number;
};
type RowProps = {
  $scale: number;
};
type GridProps = {
  $gridlength: number;
  $status: number;
  $scale: number;
};
type HouseProps = {
  $type: string;
  $scale: number;
};

const CityWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

const CityRange = styled.div<CityRangeProps>`
  margin: auto;
  position: relative;
  width: ${({ $wrapperWidth }) => `${$wrapperWidth}px`};
  border: 1px red solid;
  flex-wrap: wrap;
  gap: ${({ $gap, $scale }) => `${$gap * $scale}px`};
`;
const Row = styled.div<RowProps>`
  // border: 1px solid lightblue;
  padding-top: ${({ $scale }) => `${10 * $scale}px`};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $scale }) => `${10 * $scale}px`};
`;

const Grid = styled.div<GridProps>`
  width: ${({ $gridlength, $scale }) => `${$gridlength * $scale}px`};
  height: ${({ $gridlength, $scale }) => `${$gridlength * $scale}px`};
  border: 1px solid lightblue;
  background-color: ${({ $status }) =>
    $status === 1 ? 'lightgreen' : $status === -1 ? 'lightcoral' : ''};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const House = styled.div<HouseProps>`
  border-radius: 10px;
  width: ${({ $scale }) => `${100 * $scale}px`};
  height: ${({ $scale }) => `${100 * $scale}px`};
  background-color: ${({ $type }) => {
    switch ($type) {
      case '食物': {
        return '#e46161';
      }
      case '飲料': {
        return '#f1b963';
      }
      case '交通': {
        return '#f8f398';
      }
      default: {
        return '#cbf078';
      }
    }
  }};
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
