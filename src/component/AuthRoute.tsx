import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { LOGGED_IN, LOG_OUT } from '../redux/reducers/userInfoSlice';

export interface IAuthRouteProps {
  children?: React.ReactNode; //TODO ??
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props;
  const isLogin = useAppSelector((state) => state.userInfo);
  const dispatch = useAppDispatch();

  const auth = getAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); //TODO 時機！？

  console.log('check log in');

  useEffect(() => {
    const AuthCheck = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log('user', [{ uid: user.uid, name: user }]);
        const { uid, displayName, email, photoURL } = user;
        dispatch(LOGGED_IN({ uid, displayName, email, photoURL }));
        setIsLoading(false);
      } else {
        console.log('unauthorized');
        dispatch(LOG_OUT());
        navigate('/');
      }
    });
    // AuthCheck();

    return () => AuthCheck();
  }, [auth]);

  if (isLoading) return <p>loading...</p>;

  return <div>{children}</div>;
};

export default AuthRoute;
