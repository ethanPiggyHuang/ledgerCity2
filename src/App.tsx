import { Reset } from 'styled-reset';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { Counter } from './feature/counter/Counter';
import { GameMap } from './pages/gameMap/GameMap';
import { Ledger } from './pages/ledger/Ledger';
import { Statistics } from './pages/statistics/Statistics';
import { Profile } from './pages/profile/Profile';
// import Login from './pages/login/Login';
// import { initializeApp } from 'firebase/app';
// import { app } from './config/firebase';
import AuthRoute from './component/AuthRoute';
import Header from './component/Header';

export interface IApplicationProps {}

const App: React.FunctionComponent<IApplicationProps> = (props) => {
  return (
    <BrowserRouter>
      <Reset />
      <GlobalStyle />
      <AuthRoute>
        <Header />
        <Routes>
          <Route path="/city" element={<GameMap />} />
          {/* //TODO */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/counter" element={<Counter />} /> */}
          {/* <Route path="/ledger" element={<Ledger />} /> */}
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/city" replace />} />
        </Routes>
      </AuthRoute>
    </BrowserRouter>
  );
};

export default App;

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    /* 禁止文字選取  */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Edge */
    user-select: none; /* Standard */
    
  }
  body {
    // font-family: 'Poppins';
    // font-weight: 400;
    background: linear-gradient(#c8e2cc, #98d5da);
  }

  input {
    border: none;
    &:focus {
      outline: none;
      box-shadow: none;
      border: none;
    }
    &:focus:hover {
      outline: none;
      box-shadow: none;
      border: none;
    }
  }
  
  #root {
    min-height: 100vh;
    position: relative;
    @media screen and (max-width: 991px) {
    }
  }
`;
