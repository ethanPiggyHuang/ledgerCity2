import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

import { displayCity } from '../redux/reducers/cityArrangementSlice';

export const LoginPanel: React.FC = () => {
  const cityBasicInfo = useAppSelector((state) => state.cityBasicInfo);
  const dispatch = useAppDispatch();
  const [info, setInfo] = useState('visitor');
  const [protraitUrl, setProtraitUrl] = useState('');

  useEffect(() => {}, []);

  const handleLoginFb = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    provider.setCustomParameters({
      login_hint: 'user@example.com',
    });
    const auth = getAuth();
    auth.languageCode = 'it';
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const handleLogoutFb = () => {};

  return (
    <Wrap>
      <Title>註冊</Title>
      <Button onClick={handleLoginFb}>G登入</Button>
      <Button onClick={handleLogoutFb}>G登出</Button>
      <Info>{info}</Info>
      {protraitUrl && <Portrait src={protraitUrl} />}
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
