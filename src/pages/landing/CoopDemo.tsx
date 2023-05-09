import React from 'react';
import styled from 'styled-components/macro';
import introCoopStatus from '../../assets/intro_coop_status.png';

export const CoopDemo: React.FC = () => {
  return (
    <Wrap>
      <DemoImage src={introCoopStatus} />
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  margin-right: auto;
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
