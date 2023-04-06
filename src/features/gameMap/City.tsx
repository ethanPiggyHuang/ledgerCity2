import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  loadCityAsync,
  dropHouse,
  dragHouseStart,
  dragLightOn,
  dragLightOff,
} from './citySlice';
// import { getHouses } from './cityAPI';

export function City() {
  const cityArrangement = useAppSelector(
    (state) => state.cityArrangement.housesPosition
  );
  const gridsStatus = useAppSelector(
    (state) => state.cityArrangement.gridsStatus
  );
  const dispatch = useAppDispatch();
  const wrapperWidth = 600;
  const gap = 20;
  const gridWidth = 150;

  useEffect(() => {
    dispatch(loadCityAsync());

    // getHouses();
  }, []);

  return (
    <Wrap $wrapperWidth={wrapperWidth} $gap={gap}>
      {cityArrangement.map((row, yIndex) =>
        row.map((grid, xIndex) => {
          return (
            <Grid
              $gridWidth={gridWidth}
              $status={gridsStatus[yIndex][xIndex]}
              key={xIndex}
              // ref={testRef}
              // onDragEnter={(e) => {
              // }}
              onDragLeave={(e) => dispatch(dragLightOff())}
              onDragOver={(e) => {
                e.preventDefault();
                dispatch(dragLightOn({ xIndex: xIndex, yIndex: yIndex }));
              }}
              onDrop={(e) => {
                console.log('onDrop');
                // setTarget(0);
                dispatch(dropHouse({ xIndex: xIndex, yIndex: yIndex }));
                dispatch(dragLightOff());
              }}
              // onClick={() => dispatch(shiftPosition())}
            >
              {grid !== 0 && (
                <House
                  draggable={true}
                  onDragStart={(e: any) => {
                    //TODO any!?
                    e.target.style.opacity = '0.01';
                    dispatch(
                      dragHouseStart({
                        target: grid,
                        pastIndex: { xIndex: xIndex, yIndex: yIndex },
                      })
                    );
                  }}
                  onDragEnd={(e: any) => {
                    e.target.style.opacity = '1';
                  }}
                  $type={grid}
                >
                  {grid}
                </House>
              )}
            </Grid>
          );
        })
      )}
    </Wrap>
  );
}

type WrapProps = {
  $wrapperWidth: number;
  $gap: number;
};
type GridProps = {
  $gridWidth: number;
  $status: number;
};
type HouseProps = {
  $type: number;
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
  width: ${({ $gridWidth }) => `${$gridWidth}px`};
  height: 150px;
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
  width: 130px;
  height: 130px;
  background-color: ${({ $type }) =>
    $type === 1 ? 'skyblue' : $type === 2 ? 'pink' : 'brown'};
`;
