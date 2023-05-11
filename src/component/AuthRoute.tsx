import {
  faPlane,
  faPlaneArrival,
  faPlaneDeparture,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  CREATE_ACCOUNT,
  GET_ACCOUNT_INFO,
  TOGGLE_AUTHING,
} from '../redux/reducers/userInfoSlice';

export interface IAuthRouteProps {
  children?: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props;
  const { isAuthing } = useAppSelector((state) => state.userInfo.loginStatus);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const AuthCheck = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email, photoURL } = user;
        if (user.metadata.creationTime === user.metadata.lastSignInTime) {
          dispatch(CREATE_ACCOUNT({ uid, displayName, email, photoURL }));
        } else {
          dispatch(GET_ACCOUNT_INFO({ uid, displayName, email, photoURL }));
        }
        dispatch(TOGGLE_AUTHING(false));
        console.log('finish authing');
        navigate('/city');
      } else {
        dispatch(TOGGLE_AUTHING(false));
        console.log('unauthorized');
        navigate('/landing');
      }
    });

    return () => AuthCheck();
  }, []);

  if (isAuthing)
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
