import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export interface IAuthRouteProps {
  children?: React.ReactNode; //TODO ??
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props;
  const auth = getAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const AuthCheck = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoading(false);
      } else {
        console.log('unauthorized');
        navigate('/login');
      }
    });
    // AuthCheck();

    return () => AuthCheck();
  }, [auth]);

  if (isLoading) return <p>loading...</p>;

  return <div>{children}</div>;
};

export default AuthRoute;
