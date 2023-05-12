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
  SWITCH_GRID_LIGHT_OFF,
  SWITCH_GRID_LIGHT_ON,
} from '../../redux/reducers/citySlice';
import { citySetting } from '../../utils/gameSettings';
import { HouseCityHall } from './housesSvg/HouseCityHall';
import { HouseGround } from './housesSvg/HouseGround';
import { HouseOfClothes } from './housesSvg/HouseOfClothes';
import { HouseOfDrinks } from './housesSvg/HouseOfDrinks';
import { HouseOfFood } from './housesSvg/HouseOfFood';
import { HouseOfPlants } from './housesSvg/HouseOfPlants';
import useControlMayor from './hooks/useControlMayor';
import useDisplayCitizen from './hooks/useDisplayCitizen';

interface Props {
  house: {
    type: string;
    id: string;
  };
  xIndex: number;
  yIndex: number;
}

export const House: React.FC<Props> = ({ house, xIndex, yIndex }) => {
  const { gridGap, gridLength, houseWidth } = citySetting;
  const cityBasicInfo = useAppSelector((state) => state.city.basicInfo);
  const { housesPosition, gridsStatus, dragMode, scale } = useAppSelector(
    (state) => state.city
  );
  const dispatch = useAppDispatch();

  const [playHammerShort] = useSound(hammer_ice, { volume: 0.5 });

  useDisplayCitizen();

  useEffect(() => {
    dispatch(SET_SCALE(1));
    dispatch(RENDER_CITY(cityBasicInfo));
  }, [cityBasicInfo, dispatch]);

  return (
    <Wrapper
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
    </Wrapper>
  );
};

type HouseProps = {
  $lengthAttrs: string;
  $fontSizeAttrs: string;
  $isdraggable: boolean;
};

const Wrapper = styled.div.attrs<HouseProps>(
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
