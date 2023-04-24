import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { CHANGE_LEDGER_POSITION } from '../../redux/reducers/pageControlSlice';

export const NavBar: React.FC = () => {
  const { ledgerPosition } = useAppSelector((state) => state.pageControl);
  const dispatch = useAppDispatch();

  const handleLedger = () => {
    if (ledgerPosition === 'normal') {
      dispatch(CHANGE_LEDGER_POSITION('expand'));
    } else {
      dispatch(CHANGE_LEDGER_POSITION('normal'));
    }
  };
  return (
    <Wrapper>
      <Link to="/city">city</Link>
      <Button onClick={() => handleLedger()}>ledger</Button>
      <Link to="/statistics">statistics</Link>
      <Link to="/profile">profile</Link>
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

const Button = styled.button``;
