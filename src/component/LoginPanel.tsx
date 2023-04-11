import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { getAuth, signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { displayCity } from '../redux/reducers/cityArrangementSlice';

export const LoginPanel: React.FC = () => {
  const cityBasicInfo = useAppSelector((state) => state.cityBasicInfo);
  const dispatch = useAppDispatch();
  const [info, setInfo] = useState('aa');

  useEffect(() => {}, []);

  const handleLoginFb = () => {
    const provider = new FacebookAuthProvider();
    provider.addScope('user_friends');

    provider.setCustomParameters({
      display: 'popup',
    });
    const auth = getAuth();
    auth.languageCode = 'it';
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

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
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
      });
  };

  const handleLogoutFb = () => {};

  return (
    <Wrap>
      <Title>註冊</Title>
      <Button onClick={handleLoginFb}>FB登入</Button>
      <Button onClick={handleLogoutFb}>FB登出</Button>
      <Info>{info}</Info>
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
