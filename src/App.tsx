import { Reset } from 'styled-reset';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { Counter } from './feature/counter/Counter';
import { GameMap } from './pages/gameMap/GameMap';
import { Ledger } from './pages/ledger/Ledger';
import { Statistics } from './pages/statistics/Statistics';
// import Login from './pages/login/Login';
// import { initializeApp } from 'firebase/app';
// import { app } from './config/firebase';
import AuthRoute from './component/AuthRoute';

export interface IApplicationProps {}

const App: React.FunctionComponent<IApplicationProps> = (props) => {
  return (
    <BrowserRouter>
      <Reset />
      <GlobalStyle />
      <AuthRoute>
        <Routes>
          <Route path="/" element={<GameMap />} />
          {/* //TODO */}
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/counter" element={<Counter />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthRoute>
    </BrowserRouter>
  );
};

export default App;

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    // font-family: 'Poppins';
    // font-weight: 400;
  }
  
  #root {
    min-height: 100vh;
    position: relative;
    @media screen and (max-width: 991px) {
    }
  }
`;
