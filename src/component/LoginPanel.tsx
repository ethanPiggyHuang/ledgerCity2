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
        // console.log('isAuthing', isAuthing);
        // console.log('uid', response.user.uid);
        // console.log('user', response.user.photoURL);
        // console.log('displayName', response.user.displayName);
        // console.log('email', response.user.email);
        // console.log('帳號建立(UTC +0)', response.user.metadata.creationTime);
        // console.log('最後登入(UTC +0)', response.user.metadata.lastSignInTime);
        // console.log('user', response.user);
        // dispatch(LOGGED_IN());
        // navigate('/');
        dispatch(AUTHING_TOGGLE(false));
      })
      .catch((error) => {
        console.log('error', error);
        dispatch(AUTHING_TOGGLE(false));
      });
  };

  return (
    <Wrap>
      <Title>註冊</Title>
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