import React from 'react';
import styled from 'styled-components/macro';
import introPieChart from '../../assets/intro_pie_chart.png';
import introDetail from '../../assets/intro_detail.png';

export const StatisticsDemo: React.FC = () => {
  return (
    <Wrap>
      <DemoPie src={introPieChart} />
      <DemoDetail src={introDetail} />
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  height: fit-content;
  position: relative;
  display: flex;
  justify-content: space-around;
`;

const DemoPie = styled.img`
  width: 360px;
  transform: rotate(-2deg);
  box-shadow: 1px 1px 5px #808080;
  display: block;
`;

const DemoDetail = styled(DemoPie)`
  width: 300px;
  height: 100%;
  transform: rotate(2deg) translateY(110px);
  box-shadow: 1px 1px 5px #808080;
  display: block;
`;
