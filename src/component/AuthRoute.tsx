import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  AUTHING_TOGGLE,
  LOGGED_IN,
  LOG_OUT,
  CREATE_ACCOUNT,
} from '../redux/reducers/userInfoSlice';

export interface IAuthRouteProps {
  children?: React.ReactNode; //TODO ??
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props;
  const dispatch = useAppDispatch();
  const isAuthing = useAppSelector(
    (state) => state.userInfo.loginStatus.isAuthing
  );

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(AUTHING_TOGGLE(true));
    const AuthCheck = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email, photoURL } = user;
        if (user.metadata.creationTime === user.metadata.lastSignInTime) {
          // 使用者是第一次註冊  TODO: 確認是否註冊過
          console.log('使用者是第一次註冊');
          dispatch(CREATE_ACCOUNT({ uid, displayName, email, photoURL }));
        } else {
          // 使用者已登入過
          console.log('使用者已登入過');
          // dispatch(CREATE_ACCOUNT({ uid, displayName, email, photoURL }));
          dispatch(LOGGED_IN({ uid, displayName, email, photoURL }));
        }
        dispatch(AUTHING_TOGGLE(false));

        console.log('login user:', user);
      } else {
        dispatch(AUTHING_TOGGLE(false));
        console.log('unauthorized');
        dispatch(LOG_OUT());
        navigate('/');
      }
    });
    // AuthCheck();

    return () => AuthCheck();
  }, [auth]);

  if (isAuthing) return <LoadingText>loading...</LoadingText>;

  return <div>{children}</div>;
};

export default AuthRoute;

const LoadingText = styled.p`
  font-size: 60px;
`;
