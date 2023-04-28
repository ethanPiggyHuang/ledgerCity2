import React from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';

export const Landing: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data);

  const dispatch = useAppDispatch();

  return <Wrapper></Wrapper>;
};

// type BlackCurtainProps = {
//   $isShown: boolean;
// };

const Wrapper = styled.div`
  height: 100vh;
  position: relative;
  background: linear-gradient(#c8e2cc, #98d5da);
  overflow: hidden;
`;
