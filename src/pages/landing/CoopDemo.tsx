import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import introCoopStatus from '../../assets/intro_coop_status.png';

export const CoopDemo: React.FC = () => {
  const { demoHouses } = useAppSelector((state) => state.landingIntro);

  const dispatch = useAppDispatch();

  return (
    <Wrap>
      <DemoImage src={introCoopStatus} />
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  margin-right: auto;
  /* padding-bottom: 100px; */
  flex-wrap: flex;
  justify-content: end;
  text-align: end;
  height: fit-content;
  position: relative;
`;

const DemoImage = styled.img`
  width: 300px;
  height: 100%;
  transform: rotate(2deg) translateY(70px);
  box-shadow: 1px 1px 5px #808080;
`;
