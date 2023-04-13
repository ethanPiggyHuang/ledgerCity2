// import React, { useState } from 'react';
// import {
//   getAuth,
//   GoogleAuthProvider,
//   signInWithPopup,
//   onAuthStateChanged,
// } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import { useAppSelector, useAppDispatch } from '../../redux/hooks';
// import { LOGGED_IN } from '../../redux/reducers/userInfoSlice';
// import { rtdb } from '../../config/firebase';
// import { ref, set } from 'firebase/database';

// export interface IloginPageProps {}

// const Login: React.FunctionComponent<IloginPageProps> = (props) => {
//   // const isLogin = useAppSelector((state) => state.userInfo.isLogin);
//   const dispatch = useAppDispatch();

//   const auth = getAuth();
//   const navigate = useNavigate();
//   const [isAuthing, setIsAuthing] = useState(false);

//   const signInWithGoogle = async () => {
//     setIsAuthing(true);

//     signInWithPopup(auth, new GoogleAuthProvider())
//       .then((response) => {
//         console.log('uid', response.user.uid);
//         console.log('user', response.user.photoURL);
//         console.log('displayName', response.user.displayName);
//         console.log('email', response.user.email);
//         console.log('帳號建立(UTC +0)', response.user.metadata.creationTime);
//         console.log('最後登入(UTC +0)', response.user.metadata.lastSignInTime);
//         console.log('user', response.user);
//         // dispatch(LOGGED_IN());

//         // navigate('/');
//         //------------------------

//         // write into rtdb
//         // set(
//         //   ref(
//         //     rtdb,
//         //     `users/${response.user.uid}/${response.user.metadata.lastSignInTime}`
//         //   ),
//         //   {
//         //     lastSignInTime: response.user.metadata.lastSignInTime,
//         //   }
//         // );

//         //------------------------
//       })
//       .catch((error) => {
//         console.log('error', error);
//         setIsAuthing(false);
//       });
//   };

//   console.log('here', auth);
//   return (
//     <div>
//       <p>Login Page</p>
//       <button onClick={() => signInWithGoogle()} disabled={isAuthing}>
//         Sign in
//       </button>
//     </div>
//   );
// };

// export default Login;

export {};
