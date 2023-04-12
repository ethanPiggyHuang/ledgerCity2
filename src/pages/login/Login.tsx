import React, { useState } from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export interface IloginPageProps {}

const LoginPage: React.FunctionComponent<IloginPageProps> = (props) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [isAuthing, setIsAuthing] = useState(false);

  const signInWithGoogle = async () => {
    setIsAuthing(true);

    signInWithPopup(auth, new GoogleAuthProvider())
      .then((response) => {
        console.log('uid', response.user.uid);
        navigate('/');
      })
      .catch((error) => {
        console.log('error', error);
        setIsAuthing(false);
      });
  };
  return (
    <div>
      <p>Login Page</p>
      <button onClick={() => signInWithGoogle()} disabled={isAuthing}>
        Sign in
      </button>
    </div>
  );
};

export default LoginPage;
