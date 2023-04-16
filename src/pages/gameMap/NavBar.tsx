import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

export const NavBar: React.FC = () => {
  return (
    <Wrapper>
      <Link to="/ledger">ledger</Link>
      <Link to="/statistics">statistics</Link>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 20px;
`;
