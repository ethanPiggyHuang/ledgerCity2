import React from 'react';
import styled from 'styled-components/macro';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { LOGGED_IN, AUTHING_TOGGLE } from '../../redux/reducers/userInfoSlice';
import googleLogo from '../../assets/googleLogo.png';
import cityLandScape from '../../assets/cityLandscape.png';

export interface IloginPageProps {}

export const LoginPanel: React.FunctionComponent<IloginPageProps> = () => {
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
    <Wrap>
      <Title>登入</Title>
      <LogInWrap onClick={() => signInWithGoogle()}>
        <GoogleLogo src={googleLogo} />
        以Google登入
      </LogInWrap>
      <Text>成為市長，開始管理城市吧！</Text>
      <CityImage src={cityLandScape} />
    </Wrap>
  );
};

// type CurtainProps = {
//   $isLogin: boolean;
//   $isDialog: boolean;
// };

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 20px 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 10%;
`;
const Title = styled.p`
  line-height: 60px;
  font-size: 32px;
  font-weight: bold;
  color: #cc8159;
  margin-bottom: auto;
`;

const LogInWrap = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #cc8159;
  border: 3px #cc8159 solid;
  border-radius: 10px;
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
  width: 60px;
  display: block;
  /* transform: translateX(-50px) translateY(-22px) rotate(-7deg); */
`;

const Text = styled.p`
  font-size: 24px;
  color: #cc8159;
`;

const CityImage = styled.img`
  width: 100%;
  display: block;
  /* transform: translateX(-50px) translateY(-22px) rotate(-7deg); */
`;
