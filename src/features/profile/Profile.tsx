import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { CONTROL_PANEL_DISPLAYED } from '../../redux/reducers/pageControlSlice';
import { UserPanel } from './UserPanel';

export const Profile: React.FC = () => {
  const { userNickName, userPortraitUrl } = useAppSelector(
    (state) => state.userInfo.data
  );
  const { panelOpened } = useAppSelector((state) => state.pageControl);
  const { isTouring } = useAppSelector((state) => state.city);

  const dispatch = useAppDispatch();

  return (
    <Wrapper $isFolded={isTouring}>
      <Background />
      <TextWrap>
        <Text>{`${userNickName}市長`}</Text>
      </TextWrap>
      <PorTraitWrap
        onClick={() => {
          if (panelOpened === 'none') {
            dispatch(CONTROL_PANEL_DISPLAYED('user'));
          } else {
            dispatch(CONTROL_PANEL_DISPLAYED('none'));
          }
        }}
      >
        <PorTrait src={userPortraitUrl as string} />
      </PorTraitWrap>
      {panelOpened === 'user' && <UserPanel />}
    </Wrapper>
  );
};

type WrapperProps = {
  $isFolded: boolean;
};

const Wrapper = styled.div<WrapperProps>`
  position: fixed;
  z-index: 4;
  right: 50px;
  top: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  transition: transform 1s ease;
  transform: ${({ $isFolded }) => ($isFolded ? 'translateX(340%)' : '')};
`;
const Background = styled.div`
  position: absolute;
  z-index: -1;
  height: 120px;
  top: -10px;
  width: 18.5vw;
  border-radius: 20px;
  opacity: 0.8;
  background: linear-gradient(#c8e2cc, #c0e0cf);
`;
const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  align-items: end;
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
