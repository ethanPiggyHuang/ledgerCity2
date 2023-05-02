import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';

export const Setting: React.FC = () => {
  const { userId, cityList } = useAppSelector((state) => state.userInfo.data);

  const dispatch = useAppDispatch();

  return <Wrap></Wrap>;
};

const Wrap = styled.div`
  width: 100vw;
  padding: 20px;
  gap: 20px;
`;
