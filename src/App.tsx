import { Reset } from 'styled-reset';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { Counter } from './features/counter/Counter';
import { GameMap } from './features/gameMap/GameMap';
import { Ledger } from './features/ledger/Ledger';
import { Statistics } from './features/statistics/Statistics';

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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Reset />
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<GameMap />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
