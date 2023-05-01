import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { LOGGED_IN, AUTHING_TOGGLE } from '../../redux/reducers/userInfoSlice';
import googleLogo from '../../assets/googleLogo.png';
import cityLandScape from '../../assets/cityLandscape.png';
import loginSlogan from '../../assets/login_slogan.png';
import { LOGIN_SECTION_FOCUS_TOGGLE } from '../../redux/reducers/landingIntroSlice';

export interface IloginPageProps {}

export const LoginPanel: React.FunctionComponent<IloginPageProps> = () => {
  const { isFocusingLogin } = useAppSelector((state) => state.landingIntro);
  const dispatch = useAppDispatch();
  // const authing = useAppSelector(
  //   (state) => state.userInfo.loginStatus.isAuthing
  // );

  const auth = getAuth();

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
    <Wrap
      onMouseEnter={() => dispatch(LOGIN_SECTION_FOCUS_TOGGLE(true))}
      onMouseLeave={() =>
        setTimeout(() => dispatch(LOGIN_SECTION_FOCUS_TOGGLE(false)))
      }
    >
      <LoginSlogan $isFocusing={isFocusingLogin} src={loginSlogan} />
      <CityImage src={cityLandScape} />
      <LogInWrap
        $isFocusing={isFocusingLogin}
        onClick={() => signInWithGoogle()}
      >
        <GoogleLogo src={googleLogo} />
        以Google登入
      </LogInWrap>
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
const Title = styled.p`
  line-height: 60px;
  font-size: 32px;
  font-weight: bold;
  color: #cc8159;
  margin-bottom: auto;
`;

const flashing = keyframes`
  0%{
    filter: brightness(0.95);
  }
  50%{
    filter: brightness(1.15);
  }
  100%{
    filter: brightness(0.95);
  }
`;

const LogInWrap = styled.div<LoginElementsProps>`
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
  /* margin-top: auto; */
  gap: 20px;
  cursor: pointer;
  animation: ${flashing}
    ${({ $isFocusing }) => ($isFocusing ? '2s infinite ease' : '')};
  &:hover {
    background-color: #f2d6af;
  }
`;

const GoogleLogo = styled.img`
  max-width: 30px;
  display: block;
`;

const Text = styled.p`
  font-size: 24px;
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
  animation: ${floating}
    ${({ $isFocusing }) => ($isFocusing ? '4s ease infinite' : '')};
`;
