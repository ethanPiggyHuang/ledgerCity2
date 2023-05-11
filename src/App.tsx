import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Reset } from 'styled-reset';
import Header from './component/Header';
import { Landing } from './features/Landing/Landing';
import { Main } from './features/Main/Main';

export interface IApplicationProps {}

const App: React.FunctionComponent<IApplicationProps> = (props) => {
  return (
    <BrowserRouter>
      <Reset />
      <GlobalStyle />
      {/* <AuthRoute> */}
      <Header />
      <Routes>
        <Route index path="/landing" element={<Landing />} />
        <Route path="/" element={<Main />} />
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
      {/* </AuthRoute> */}
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
