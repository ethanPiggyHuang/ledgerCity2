import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Reset } from 'styled-reset';
import Header from './component/Header';
import { Landing } from './features/Landing/Landing';
import { Main } from './features/Main/Main';
import AuthRoute from './component/AuthRoute';

export interface IApplicationProps {}

const App: React.FunctionComponent<IApplicationProps> = (props) => {
  return (
    <BrowserRouter>
      <Reset />
      <GlobalStyle />
      <AuthRoute>
        <Header />
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/city" element={<Main />} />
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
    -webkit-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none;
    user-select: none;
    
  }
  body {
    font-family: 'Noto Sans', sans-serif;
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
    -webkit-user-select:text;
    user-select:text;
  }
  
  #root {
    min-height: 100vh;
    position: relative;
    @media screen and (max-width: 991px) {
    }
  }
`;
