import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { HouseOfFood } from '../city/housesSvg/HouseOfFood';
import { HouseOfClothes } from '../city/housesSvg/HouseOfClothes';
import { HouseOfDrinks } from '../city/housesSvg/HouseOfDrinks';
import { HouseGrid } from '../city/housesSvg/HouseGrid';
import { HouseOfPlants } from '../city/housesSvg/HouseOfPlants';
import { SET_SCALE } from '../../redux/reducers/cityArrangementSlice';

export const CityDemo: React.FC = () => {
  const { demoHouses } = useAppSelector((state) => state.landingIntro);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(SET_SCALE(0.75));
  }, []);

  return (
    <CityRange>
      {demoHouses.map((row, yIndex) => {
        return (
          <Row key={yIndex}>
            {row.map((house, xIndex) => {
              return (
                <Grid key={xIndex}>
                  {house.type !== '' ? (
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
                  ) : (
                    <ReadySpot />
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
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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

const flashing = keyframes`
  0%{
    opacity:0;
  }
  66%{
    opacity:1;
  }
  100%{
    opacity:1;
  }
`;

const ReadySpot = styled.div`
  width: 116px;
  height: 186px;
  transform: translateY(32px);

  border: 3px dashed #ac9c89;
  animation: ${flashing} 1.2s ease infinite alternate;
`;
