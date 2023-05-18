import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import cityLandScape from '../../assets/cityLandscape.png';
import googleLogo from '../../assets/googleLogo.png';
import loginSlogan from '../../assets/login_slogan.png';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { TOGGLE_LOGIN_SECTION_FOCUS } from '../../redux/reducers/landingIntroSlice';
import { TOGGLE_AUTHING } from '../../redux/reducers/userInfoSlice';
import { FirebaseError } from 'firebase/app';

export const LoginPanel: React.FC = () => {
  const { isFocusingLogin } = useAppSelector((state) => state.landingIntro);
  const dispatch = useAppDispatch();

  const auth = getAuth();

  const GoogleLogin = async () => {
    dispatch(TOGGLE_AUTHING(true));
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.log('error', error);
    }
  };
  const nativeRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'testing@gmail.com',
        '12345678'
      );
      console.log(userCredential.user);
    } catch (error: any) {
      console.log(error.code);
    }
  };
  const nativeLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        'testing@gmail.com',
        '12345678'
      );
      console.log(userCredential.user);
    } catch (error: any) {
      console.log(error.code);
    }
  };

  return (
    <Wrap
      onMouseEnter={() => dispatch(TOGGLE_LOGIN_SECTION_FOCUS(true))}
      onMouseLeave={() =>
        setTimeout(() => dispatch(TOGGLE_LOGIN_SECTION_FOCUS(false)))
      }
    >
      <LoginSlogan $isFocusing={isFocusingLogin} src={loginSlogan} />
      <CityImage src={cityLandScape} />
      <LoginInput value={'eee'} />
      <LoginWrap $isFocusing={isFocusingLogin} onClick={nativeRegister}>
        native註冊
      </LoginWrap>
      <LoginWrap $isFocusing={isFocusingLogin} onClick={nativeLogin}>
        native登入
      </LoginWrap>
      <LoginWrap $isFocusing={isFocusingLogin} onClick={GoogleLogin}>
        <GoogleLogo src={googleLogo} />
        以Google登入
      </LoginWrap>
    </Wrap>
  );
};

type LoginElementsProps = {
  $isFocusing: boolean;
};

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 20px 10px;
  border-radius: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(#9dd7d9, #f2f2f2);

  gap: 10%;
`;

const LoginWrap = styled.div<LoginElementsProps>`
  font-size: 24px;
  font-weight: bold;
  color: #cc8159;
  border: 3px #cc8159 solid;
  border-radius: 50px;
  padding: 10px 30px;
  background-color: #f2d6af7e;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  &:hover {
    background-color: #f2d6af;
  }
`;

const GoogleLogo = styled.img`
  max-width: 30px;
  display: block;
`;

const LoginInput = styled.input`
  color: #cc8159;
`;

const floating = keyframes`
  0%{
    transform: translateY(0) translateX(0px);
  }
  25%{
    transform: translateY(-15px) translateX(-2px); 
  }
  50%{
    transform: translateY(0) translateX(0px);
  }
  75%{
    transform: translateY(-15px) translateX(2px);
  }
  100%{
    transform: translateY(0) translateX(0px);
  }
`;

const CityImage = styled.img`
  margin-top: auto;
  width: 100%;
  display: block;
`;

const LoginSlogan = styled.img<LoginElementsProps>`
  margin-top: auto;
  width: 100%;
  display: block;
  animation: ${({ $isFocusing }) => ($isFocusing ? '4s ease infinite' : '')};
  animation-name: ${floating};
`;
