import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { LOGGED_IN } from '../redux/reducers/userInfoSlice';

export interface IloginPageProps {}

export const LoginPanel: React.FunctionComponent<IloginPageProps> = () => {
  const dispatch = useAppDispatch();

  const auth = getAuth();
  const navigate = useNavigate();
  const [isAuthing, setIsAuthing] = useState(false);

  const signInWithGoogle = async () => {
    setIsAuthing(true);

    signInWithPopup(auth, new GoogleAuthProvider())
      .then((response) => {
        console.log('uid', response.user.uid);
        console.log('user', response.user.photoURL);
        // console.log('displayName', response.user.displayName);
        // console.log('email', response.user.email);
        // console.log('帳號建立(UTC +0)', response.user.metadata.creationTime);
        // console.log('最後登入(UTC +0)', response.user.metadata.lastSignInTime);
        // console.log('user', response.user);
        dispatch(LOGGED_IN());

        // navigate('/');
      })
      .catch((error) => {
        console.log('error', error);
        setIsAuthing(false);
      });
  };

  return (
    <Wrap>
      <Title>註冊</Title>
      <Button onClick={() => signInWithGoogle()}>Google登入</Button>
      {/* <Button onClick={handleLogoutFb}>G登出</Button> */}
      {/* <Info>{info}</Info> */}
      {/* {protraitUrl && <Portrait src={protraitUrl} />} */}
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
const Info = styled.p`
  font-size: 32px;
`;
const Portrait = styled.img`
  width: 100px;
  height: 100px;
`;
