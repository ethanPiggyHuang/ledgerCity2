import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  AUTHING_TOGGLE,
  GET_ACCOUNT_INFO,
  CREATE_ACCOUNT,
} from '../redux/reducers/userInfoSlice';

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

  const auth = getAuth();

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
          dispatch(GET_ACCOUNT_INFO({ uid, displayName, email, photoURL }));
        }
        dispatch(AUTHING_TOGGLE(false));
      } else {
        dispatch(AUTHING_TOGGLE(false));
        console.log('unauthorized');
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

  if (isAuthing) return <LoadingText>loading...</LoadingText>;

  return <div>{children}</div>;
};

export default AuthRoute;

const LoadingText = styled.p`
  font-size: 60px;
`;
