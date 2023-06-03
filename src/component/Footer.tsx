import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faChartPie,
  faFilePen,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  CONTROL_PANEL_DISPLAYED,
  SWITCH_SECTION_FOCUSED,
} from '../redux/reducers/pageControlSlice';

const Footer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pageActivity } = useAppSelector((state) => state.pageControl);
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { isTouring } = useAppSelector((state) => state.city);
  const labelOrder: {
    page: 'ledger' | 'statistics' | 'profile';
    icon: IconDefinition;
    textCh: string;
  }[] = [
    { page: 'statistics', icon: faChartPie, textCh: '分析' },
    { page: 'ledger', icon: faFilePen, textCh: '記帳' },
    { page: 'profile', icon: faUsers, textCh: '協作' },
  ];

  const handleSwitchSection = (page: 'ledger' | 'statistics' | 'profile') => {
    dispatch(SWITCH_SECTION_FOCUSED({ userId, pageActivity: page }));
    dispatch(CONTROL_PANEL_DISPLAYED('none'));
  };

  return (
    <Wrapper $isFolded={isTouring}>
      {labelOrder.map((label) => (
        <SectionLabel
          key={label.page}
          onClick={() => handleSwitchSection(label.page)}
          $chosen={label.page === pageActivity}
          $pageActivity={pageActivity}
        >
          <StyledFontAwesomeIcon icon={label.icon} />
          <Text>{label.textCh}</Text>
        </SectionLabel>
      ))}
    </Wrapper>
  );
};

export default Footer;

type SectionLabelState = {
  $chosen: boolean;
  $pageActivity:
    | 'city'
    | 'rearrange'
    | 'ledger'
    | 'statistics'
    | 'profile'
    | 'leave';
};

type WrapperProps = {
  $isFolded: boolean;
};

const Wrapper = styled.div<WrapperProps>`
  width: 100vw;
  position: fixed;
  z-index: 5;
  bottom: -20px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 1s ease;
  transform: ${({ $isFolded }) => ($isFolded ? 'translateY(120%)' : '')};
`;
const SectionLabel = styled.div<SectionLabelState>`
  height: 100px;
  width: ${({ $chosen }) => ($chosen ? '40%' : '30%')};
  background-color: ${({ $chosen }) => ($chosen ? '#f7f7f7' : '#ebebeb')};
  border-radius: ${({ $pageActivity }) =>
    $pageActivity === 'statistics' ? '0' : '20px 20px 0 0'};
  border: 2px solid white;
  padding-top: 18px;
  display: flex;
  justify-content: center;
  transition: transform 0.5s ease, width 0.5s ease, border-radius 0.5s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-20px);
    width: 40%;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #808080;
  height: 36px;
`;

const Text = styled.p`
  line-height: 36px;
  padding-left: 10px;
  color: #808080;
  font-size: 24px;
`;
