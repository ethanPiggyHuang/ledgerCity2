import { Reset } from 'styled-reset';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { Main } from './features/main/Main';
import AuthRoute from './component/AuthRoute';
import Header from './component/Header';
import { Landing } from './features/landing/Landing';

export interface IApplicationProps {}

const App: React.FunctionComponent<IApplicationProps> = (props) => {
  return (
    <BrowserRouter>
      <Reset />
      <GlobalStyle />
      <AuthRoute>
        <Header />
        <Routes>
          <Route path="/city" element={<Main />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="*" element={<Navigate to="/landing" replace />} />
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
    font-family: 'Noto Sans', sans-serif;
    /* font-family: 'Taipei Sans TC'; */
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
    -webkit-user-select:text !important;
  }
  
  #root {
    min-height: 100vh;
    position: relative;
    @media screen and (max-width: 991px) {
    }
  }
`;
