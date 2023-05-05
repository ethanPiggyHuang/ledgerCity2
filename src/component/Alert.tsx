import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  ALERT_DIALOUGE_TOGGLE,
  ALERT_TOGGLE,
  SWITCH_PAGE,
} from '../redux/reducers/pageControlSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface Props {
  title: string;
  text: string;
}

export const Alert: React.FC<Props> = ({ title, text }) => {
  const { isShown, dialogueOpen } = useAppSelector(
    (state) => state.pageControl.alert
  );
  const dispatch = useAppDispatch();

  return (
    <Wrap $isShown={isShown}>
      <BlackCurtain></BlackCurtain>
      <Dialogue $isShown={dialogueOpen}>
        <button
          onClick={() => {
            dispatch(ALERT_DIALOUGE_TOGGLE());
            setTimeout(() => dispatch(ALERT_TOGGLE()), 400);
          }}
        >
          close
        </button>
      </Dialogue>
    </Wrap>
  );
};

type WrapProps = {
  $isShown: boolean;
};
type DialogueProps = {
  $isShown: boolean;
};

const showUp = keyframes`
  0%{
    z-index: -10;
  }
  10%{
    z-index: 10;
  }
  100%{
    z-index: 10;
  }
`;

const Wrap = styled.div<WrapProps>`
  /* display: ${({ $isShown }) => ($isShown ? 'block' : 'none')}; */
  position: fixed;
  z-index: ${({ $isShown }) => ($isShown ? '10' : '-10')};
  left: 0;
  top: 0;
  animation-name: ${showUp} 1s linear 1;
  /* animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: 1;
  animation-direction: ${({ $isShown }) =>
    $isShown ? 'reverse' : 'reverse'}; */
  /* transition: 1s ease; */
`;

const BlackCurtain = styled.div`
  position: absolute;
  z-index: 0;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #00000066;
`;
const Dialogue = styled.div<DialogueProps>`
  position: absolute;
  z-index: 1;
  left: ${({ $isShown }) => ($isShown ? 'calc(50vw - 200px)' : '50vw')};
  top: ${({ $isShown }) => ($isShown ? 'calc(50vh - 150px)' : '50vh')};
  width: ${({ $isShown }) => ($isShown ? '400px' : '0')};
  height: ${({ $isShown }) => ($isShown ? '300px' : '0')};
  opacity: ${({ $isShown }) => ($isShown ? '1' : '0')};
  background-color: #f2f2f2;
  transition: 0.5s ease;
`;
