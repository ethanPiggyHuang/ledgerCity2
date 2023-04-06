import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { dropHouse } from './CitySlice';

export function City() {
  const housesPosition = useAppSelector((state) => state.housesPosition.value);
  const dispatch = useAppDispatch();
  const [target, setTarget] = useState<number>(0);
  const [pastIndex, setPastIndex] = useState(0);
  const wrapperWidth = 600;
  const gap = 20;
  const gridWidth = 150;
  const gridStatus = [0, 0, 0, 0, 0, 0];

  return (
    <Wrap $wrapperWidth={wrapperWidth} $gap={gap}>
      {housesPosition.map((grid, index: number) => {
        return (
          <Grid
            $gridWidth={gridWidth}
            $status={gridStatus[index]}
            key={index}
            // ref={testRef}
            // onDragEnter={(e) => {
            //   const newShine = [...shine].fill(0);
            //   setShine(newShine);
            // }}
            // onDragLeave={(e) => {
            //   // console.log("onDragLeave", i);
            //   // setPastIndex(i);
            //   const newShine = [...shine].fill(0);
            //   setShine(newShine);
            // }}
            onDragOver={(e) => {
              e.preventDefault();
              // if (target !== 0) {
              //   const newShine = [...shine];
              //   if (i === pastIndex || test[i] === 0) {
              //     newShine[i] = 1;
              //   } else {
              //     newShine[i] = -1;
              //   }
              //   setShine(newShine);
              // }
            }}
            onDrop={(e) => {
              console.log('onDrop');
              setTarget(0);
              // if (housesPosition[index] !== 0) {
              // } else {
              //   const newState = [...housesPosition];
              //   newState[pastIndex] = 0;
              //   newState[index] = target;
              //   console.log('target', target);
              dispatch(
                dropHouse({
                  index: index,
                  target: target,
                  pastIndex: pastIndex,
                })
              );
              // }
              // const newShine = [...shine].fill(0);
              // setShine(newShine);
            }}
            // onClick={() => dispatch(shiftPosition())}
          >
            {grid !== 0 && (
              <House
                draggable={true}
                onDragStart={(e: any) => {
                  e.target.style.opacity = '0.01'; //TODO
                  setTarget(grid);
                  setPastIndex(index);
                  // const newShine = [...shine].fill(0);
                  // setShine(newShine);
                }}
                onDragEnd={(e: any) => {
                  e.target.style.opacity = '1';
                }}
                //   colorCode={item}
                type={grid}
              ></House>
            )}
          </Grid>
        );
      })}
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
  type: number;
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
  width: 150px;
  height: 160px;
  background-color: ${({ type }) =>
    type === 1 ? 'skyblue' : type === 2 ? 'pink' : 'brown'};
`;
