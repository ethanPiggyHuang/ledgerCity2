import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  CREATE_ACCOUNT,
  GET_ACCOUNT_INFO,
  TOGGLE_AUTHING,
} from '../redux/reducers/userInfoSlice';
import Loading from './Loading';

export interface IAuthRouteProps {
  children: React.ReactNode;
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
        const isNewUser =
          user.metadata.creationTime === user.metadata.lastSignInTime;
        if (isNewUser) {
          dispatch(CREATE_ACCOUNT({ uid, displayName, email, photoURL }));
        } else {
          dispatch(GET_ACCOUNT_INFO({ uid, displayName, email, photoURL }));
        }
        dispatch(TOGGLE_AUTHING(false));
        navigate('/city');
      } else {
        dispatch(TOGGLE_AUTHING(false));
        navigate('/landing');
      }
    });

    return () => AuthCheck();
  }, []);

  if (isAuthing) return <Loading />;
  return <div>{children}</div>;
};

export default AuthRoute;
