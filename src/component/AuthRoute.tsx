import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  AUTHING_TOGGLE,
  GET_ACCOUNT_INFO,
  CREATE_ACCOUNT,
} from '../redux/reducers/userInfoSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlaneDeparture,
  faPlane,
  faPlaneArrival,
} from '@fortawesome/free-solid-svg-icons';

export interface IAuthRouteProps {
  children?: React.ReactNode; //TODO ??
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props;
  const dispatch = useAppDispatch();
  const { isAuthing, isLogin } = useAppSelector(
    (state) => state.userInfo.loginStatus
  );
  const { ledgerBookId } = useAppSelector((state) => state.cityBasicInfo);
  const { cityList } = useAppSelector((state) => state.userInfo.data);

  const navigate = useNavigate();

  const auth = getAuth();

  useEffect(() => {
    dispatch(AUTHING_TOGGLE(true));
    const AuthCheck = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email, photoURL } = user;
        if (user.metadata.creationTime === user.metadata.lastSignInTime) {
          // 使用者是第一次註冊  TODO: 確認是否註冊過
          dispatch(CREATE_ACCOUNT({ uid, displayName, email, photoURL }));
        } else {
          // 使用者已登入過
          dispatch(GET_ACCOUNT_INFO({ uid, displayName, email, photoURL }));
        }
        dispatch(AUTHING_TOGGLE(false));
      } else {
        dispatch(AUTHING_TOGGLE(false));
        console.log('unauthorized');
        navigate('/landing');
      }
    });
    // AuthCheck();

    return () => AuthCheck();
  }, [auth]);

  // useEffect(() => {
  //   if (cityList.length !== 0) {
  //     dispatch(VISIT_CITY(cityList[0]));
  //     console.log('go fetch');
  //   }
  // }, [cityList]);

  // useEffect(() => {
  //   if (ledgerBookId.length !== 0) {
  //     dispatch(getLedgerList(ledgerBookId));
  //   }
  // }, [ledgerBookId]);

  // if (isAuthing)
  return (
    <LoadingMessage>
      <LoadingText>前往城市中...</LoadingText>
      <LoadingIconDeparture icon={faPlaneDeparture} />
      <LoadingIconFlying icon={faPlane} />
      <LoadingIconLanding icon={faPlaneArrival} />
    </LoadingMessage>
  );

  return <div>{children}</div>;
};

export default AuthRoute;

const LoadingMessage = styled.div`
  min-height: 80vh;

  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #cc8159;
`;

const LoadingText = styled.p`
  font-size: 60px;
`;

const departure = keyframes`
  0%{
    opacity: 1;
  }
  17%{
    opacity: 1;
  }
  33%{
    opacity: 0;
  }
  100%{
    opacity: 0;
  }
`;

const flying = keyframes`
  0%{
    opacity: 0;
  }
  17%{
    opacity: 0;
  }
  33%{
    opacity: 1;
  }
  50%{
    opacity: 1;
  }
  66%{
    opacity: 0;
  }
  100%{
    opacity: 0;
  }

`;

const landing = keyframes`
  0%{
    opacity: 0;
  }
  50%{
    opacity: 0;
  }
  66%{
    opacity: 1;
  }
  83%{
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
`;

const LoadingIconFlying = styled(FontAwesomeIcon)`
  font-size: 48px;
  padding: 20px 20px 60px;
  animation: ${flying} 3s infinite;
`;

const LoadingIconDeparture = styled(FontAwesomeIcon)`
  font-size: 48px;
  animation: ${departure} 3s infinite;
`;

const LoadingIconLanding = styled(FontAwesomeIcon)`
  font-size: 48px;
  animation: ${landing} 3s infinite;
`;
