import React from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { GeneralAnalysis } from './GeneralAnalysis';
import { getAuth } from 'firebase/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';
import { ClosingButton } from '../../component/ClosingButton';

export const Statistics: React.FC = () => {
  const { chartType } = useAppSelector((state) => state.pageControl);
  const { pageActivity } = useAppSelector((state) => state.pageControl);

  return (
    <Wrap $isShown={pageActivity === 'statistics'}>
      <Header>
        <StyledFontAwesomeIcon icon={faChartPie} />
        <Title>{'分析'}</Title>
        <ClosingButton size={60} />
      </Header>
      <Main>{chartType === 'oneMonth' && <GeneralAnalysis />}</Main>
    </Wrap>
  );
};

type WrapProps = {
  $isShown: boolean;
};

const Wrap = styled.div<WrapProps>`
  border: #ffffff 3px solid;
  background-color: #f2f2f2;
  border-radius: ${({ $isShown }) => ($isShown ? '0px' : '20px')};
  color: #808080;

  width: ${({ $isShown }) => ($isShown ? '100%' : '40%')};
  height: calc(100vh - 80px);
  position: absolute;
  left: 0;
  z-index: 6;
  overflow: hidden;
  bottom: ${({ $isShown }) => ($isShown ? '80px' : '-100%')};
  transition: bottom 1s ease, width 1.5s ease, border-radius 1.5s ease;
`;
const Header = styled.div`
  height: 60px;
  width: 100%;
  border-bottom: 3px solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #808080;
  height: 40px;
`;

const Title = styled.p`
  padding-left: 10px;
  line-height: 60px;
  color: #808080;
  font-size: 28px;
`;

const Main = styled.div``;
