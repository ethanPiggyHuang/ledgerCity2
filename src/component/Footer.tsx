import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faFilePen,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { SWITCH_PAGE, PANEL_CONTROL } from '../redux/reducers/pageControlSlice';

const Footer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pageActivity } = useAppSelector((state) => state.pageControl);
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const labelOrder: {
    page: 'ledger' | 'statistics' | 'profile';
    icon: IconDefinition;
  }[] = [
    { page: 'statistics', icon: faChartPie },
    { page: 'ledger', icon: faFilePen },
    { page: 'profile', icon: faUsers },
  ];

  return (
    <Wrapper>
      {labelOrder.map((label) => (
        <SectionLabel
          key={label.page}
          onClick={() => {
            dispatch(SWITCH_PAGE({ userId, pageActivity: label.page }));
            dispatch(PANEL_CONTROL('none'));
          }}
          $chosen={label.page === pageActivity}
        >
          <StyledFontAwesomeIcon icon={label.icon} />
        </SectionLabel>
      ))}
    </Wrapper>
  );
};

export default Footer;

type SectionLabelState = {
  $chosen: boolean;
};

const Wrapper = styled.div`
  width: 100vw;
  position: fixed;
  z-index: 5;
  bottom: -20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SectionLabel = styled.div<SectionLabelState>`
  height: 100px;
  width: ${({ $chosen }) => ($chosen ? '40%' : '30%')};
  background-color: ${({ $chosen }) => ($chosen ? '#f7f7f7' : '#ebebeb')};
  border-radius: 20px 20px 0 0;
  border: 2px solid white;
  padding-top: 18px;
  display: flex;
  justify-content: center;
  transition: transform 0.5s ease, width 0.5s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-20px);
    width: 40%;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #808080;
  height: 50px;
`;
