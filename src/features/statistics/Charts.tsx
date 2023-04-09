import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

export const Charts: React.FC = () => {
  const { housesPosition } = useAppSelector((state) => state.cityArrangement);

  const dispatch = useAppDispatch();

  return <Wrap></Wrap>;
};

const Wrap = styled.div`
  padding: 20px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  height: 40vh;
  width: 100vw;
  border: 1px solid lightblue;
`;
