import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { LOG_OUT } from '../../redux/reducers/userInfoSlice';
import { UserPanel } from './UserPanel';
import { PANEL_CONTROL } from '../../redux/reducers/pageControlSlice';

export const UserBar: React.FC = () => {
  const { userId, userNickName, userPortraitUrl, cityList } = useAppSelector(
    (state) => state.userInfo.data
  );
  const { panelOpened } = useAppSelector((state) => state.pageControl);

  const dispatch = useAppDispatch();

  return (
    <Wrapper>
      <TextWrap>
        <Text>{`歡迎回來，${userNickName}市長`}</Text>
      </TextWrap>
      <PorTraitWrap
        onClick={() => {
          if (panelOpened === 'none') {
            dispatch(PANEL_CONTROL('user'));
          } else {
            dispatch(PANEL_CONTROL('none'));
          }
        }}
      >
        <PorTrait src={userPortraitUrl as string} />
      </PorTraitWrap>
      {panelOpened === 'user' && <UserPanel />}
    </Wrapper>
  );
};

// type IconBackProps = {
//   $isActivate: boolean;
// };

const Wrapper = styled.div`
  position: fixed;
  z-index: 4;
  right: 50px;
  top: 30px;
  /* width: 18.5vw; */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
`;
const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
`;

const Text = styled.p`
  font-size: 20px;

  letter-spacing: 16%;
  color: #ae7a00;
  font-weight: bold;
`;

const giggle = keyframes`
  0%{
    transform: translateY(0px);
  }
  15%{
    transform: translateY(-8px);
  }
  30%{
    transform: translateY(0px);
  }
  45%{
    transform: translateY(-8px);
  }
  60%{
    transform: translateY(0px);
  }
  100%{
    transform: translateY(0px);
  }
`;

const PorTraitWrap = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: 2px rgba(255, 255, 255, 0.6) solid;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    animation: ${giggle} 1.5s linear infinite;
  }
`;

const PorTrait = styled.img`
  height: 100%;
  object-fit: contain;
`;
