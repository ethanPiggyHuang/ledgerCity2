import React from 'react';
import styled from 'styled-components/macro';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { LOGGED_IN, AUTHING_TOGGLE } from '../redux/reducers/userInfoSlice';

export interface IloginPageProps {}

export const LoginPanel: React.FunctionComponent<IloginPageProps> = () => {
  const dispatch = useAppDispatch();
  // const authing = useAppSelector(
  //   (state) => state.userInfo.loginStatus.isAuthing
  // );

  const auth = getAuth();
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    dispatch(AUTHING_TOGGLE(true));
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((response) => {
        dispatch(AUTHING_TOGGLE(false));
      })
      .catch((error) => {
        console.log('error', error);
        dispatch(AUTHING_TOGGLE(false));
      });
  };

  return (
    <Wrap>
      <Title>登入</Title>
      <Button onClick={() => signInWithGoogle()}>Google登入</Button>
    </Wrap>
  );
};

// type CurtainProps = {
//   $isLogin: boolean;
//   $isDialog: boolean;
// };

const Wrap = styled.div`
  width: 50vw;
  height: 70vh;
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const Title = styled.p`
  font-size: 32px;
`;
const Button = styled.button`
  font-size: 32px;
`;
