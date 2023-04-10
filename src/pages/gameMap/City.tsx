import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  displayCity,
  saveCityAsync,
  dropHouse,
  dragHouseStart,
  dragLightOn,
  dragLightOff,
  draggableSwitch,
} from '../../redux/reducers/cityArrangementSlice';

export const City: React.FC = () => {
  const cityBasicInfo = useAppSelector((state) => state.cityBasicInfo);
  const { housesPosition, gridsStatus, isHouseDraggable } = useAppSelector(
    (state) => state.cityArrangement
  );
  const dispatch = useAppDispatch();
  const wrapperWidth = 600;
  const gap = 20;
  const gridlength = 150;
  const zoomRatio = 1; //TODO ratio

  // console.log(housesPosition);

  useEffect(() => {
    dispatch(displayCity(cityBasicInfo));
  }, [cityBasicInfo, dispatch]);

  return (
    <>
      <Wrap $wrapperWidth={wrapperWidth} $gap={gap}>
        {housesPosition.map((row, yIndex) => {
          return row.map((house, xIndex) => {
            return (
              <Grid
                $gridlength={gridlength}
                $zoomRatio={zoomRatio}
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
                    $zoomRatio={zoomRatio}
                    $type={house.type}
                    draggable={isHouseDraggable}
                    onDragStart={(e: any) => {
                      //TODO any!?
                      if (isHouseDraggable) {
                        e.target.style.opacity = '0.01';
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
                    onDragEnd={(e: any) => {
                      e.target.style.opacity = '1';
                    }}
                  >
                    {house.type}
                  </House>
                )}
              </Grid>
            );
          });
        })}
      </Wrap>
      <button
        onClick={() => {
          isHouseDraggable
            ? dispatch(saveCityAsync(cityBasicInfo.houses))
            : dispatch(draggableSwitch());
        }}
      >
        {isHouseDraggable ? '儲存' : '街道重建'}
      </button>
    </>
  );
};

type WrapProps = {
  $wrapperWidth: number;
  $gap: number;
};
type GridProps = {
  $gridlength: number;
  $zoomRatio: number;
  $status: number;
};
type HouseProps = {
  $zoomRatio: number;
  $type: string;
};

const Wrap = styled.div<WrapProps>`
  padding-top: 20px;
  padding-left: 20px;
  position: relative;
  display: flex;
  width: ${({ $wrapperWidth }) => `${$wrapperWidth}px`};
  border: 1px solid lightblue;
  flex-wrap: wrap;
  gap: ${({ $gap }) => `${$gap}px`};
`;

const Grid = styled.div<GridProps>`
  width: ${({ $gridlength, $zoomRatio }) => `${$gridlength * $zoomRatio}px`};
  height: ${({ $gridlength, $zoomRatio }) => `${$gridlength * $zoomRatio}px`};
  border: 1px solid lightblue;
  box-sizing: border-box;
  background-color: ${({ $status }) =>
    $status === 1 ? 'lightgreen' : $status === -1 ? 'lightcoral' : ''};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const House = styled.div<HouseProps>`
  border-radius: 10px;
  width: ${({ $zoomRatio }) => `${130 * $zoomRatio}px`};
  height: ${({ $zoomRatio }) => `${130 * $zoomRatio}px`};
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
  display: flex;
  align-items: center;
  justify-content: center;
`;
