import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { City } from './City';

export const GameMap: React.FC = () => {
  return (
    <>
      <City />
    </>
  );
};
