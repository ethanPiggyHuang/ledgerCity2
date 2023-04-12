import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  getAuth,
  signInWithPopup,
  FacebookAuthProvider,
  getAdditionalUserInfo,
  signOut,
} from 'firebase/auth';
import { displayCity } from '../redux/reducers/cityArrangementSlice';

export const LoginPanel: React.FC = () => {
  const cityBasicInfo = useAppSelector((state) => state.cityBasicInfo);
  const dispatch = useAppDispatch();
  const [info, setInfo] = useState('visitor');
  const [protraitUrl, setProtraitUrl] = useState('');

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
        const accessToken = credential?.accessToken; //TODO

        const IdP = getAdditionalUserInfo(result);
        if (IdP) {
          const profile = IdP.profile;
          return profile;
        }
      })
      .then((profile) => {
        if (profile?.name) {
          const name = profile?.name as string;
          const picture = profile?.picture as {
            data: { [key: string]: string };
          };
          console.log('then', profile);
          setInfo(name);
          setProtraitUrl(picture.data.url);
        }
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

  const handleLogoutFb = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('Sign-out successful');
      })
      .catch((error) => {
        // An error happened.
        console.log('An error happened');
      });
  };

  return (
    <Wrap>
      <Title>註冊</Title>
      <Button onClick={handleLoginFb}>FB登入</Button>
      <Button onClick={handleLogoutFb}>FB登出</Button>
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
