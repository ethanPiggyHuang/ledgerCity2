import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
import styled, { keyframes } from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import hammer_ice from '../../assets/hammer_ice.wav';
import { HouseOfFood } from '../gameMap/housesSvg/HouseOfFood';
import { HouseOfClothes } from '../gameMap/housesSvg/HouseOfClothes';
import { HouseOfDrinks } from '../gameMap/housesSvg/HouseOfDrinks';
import { HouseGrid } from '../gameMap/housesSvg/HouseGrid';
import { HouseOfPlants } from '../gameMap/housesSvg/HouseOfPlants';
import { SET_SCALE } from '../../redux/reducers/cityArrangementSlice';

export const CityDemo: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(SET_SCALE(0.75));
  }, []);

  const housesPosition = [
    [
      { type: '食物', id: 'landing0' },
      { type: '', id: '' },
      { type: '植物', id: 'landing2' },
    ],
  ];
  const nextPosition = { xIndex: 1, yIndex: 0 };

  return (
    <CityRange>
      {housesPosition.map((row, yIndex) => {
        return (
          <Row key={yIndex}>
            {row.map((house, xIndex) => {
              return (
                <Grid key={xIndex}>
                  {house.type !== '' && (
                    <>
                      <HouseGrid houseType={house.type} />
                      <House>
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

const display = keyframes`
  0%{
    opacity: 0;
  }
  50%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`;

const CityRange = styled.div`
  width: 360px;
  height: 120px;
  margin-right: auto;
  flex-wrap: wrap;
  height: fit-content;
  position: relative;
  animation: ${display} 2s linear forwards;
  /* align-self: 30px; */
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: 1px blue solid; */
`;

const Grid = styled.div`
  width: 120px;
  height: 120px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const House = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
