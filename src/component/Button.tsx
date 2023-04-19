import React from 'react';
import styled from 'styled-components/macro';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { LOGGED_IN, AUTHING_TOGGLE } from '../redux/reducers/userInfoSlice';

interface Props {
  type: string;
}

export const Button: React.FC<Props> = ({ type }) => {
  const dispatch = useAppDispatch();

  return (
    <ButtonWrap $type={type}>
      <Text>{type}</Text>
    </ButtonWrap>
  );
};

type ButtonWrapProps = {
  $type: string;
};

const ButtonWrap = styled.button<ButtonWrapProps>`
  width: 60px;
  height: 20px;
  background-color: ${({ $type }) =>
    $type === 'confirm' ? 'blue' : $type === 'cancel' ? 'white' : 'grey'};
  color: ${({ $type }) =>
    $type === 'confirm' ? 'white' : $type === 'cancel' ? 'blue' : 'white'};
  cursor: ${({ $type }) => ($type === 'edit' ? 'forbidden' : '')};
`;
const Text = styled.p`
  font-size: 16px;
`;
