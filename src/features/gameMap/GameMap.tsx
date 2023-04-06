import React from 'react';
import styled from 'styled-components';
import { onSnapshot } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { City } from './City';

export const GameMap: React.FC = () => {
  return (
    <>
      <City />
    </>
  );
};
