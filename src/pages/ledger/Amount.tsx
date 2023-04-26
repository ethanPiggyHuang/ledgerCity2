import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';

export const Amount: React.FC = () => {
  const { number } = useAppSelector((state) => state.ledgerSingle.data.amount);

  return <AmountText>{`$ ${number}`}</AmountText>;
};

type LabelOptionProps = {
  $isChosen: boolean;
  $color: string;
};
const AmountText = styled.p`
  height: 10%;
  margin: 0 15px;
  color: #808080;
  font-size: 28px;
  display: flex;
  align-items: center;
  color: #dabd7a;
`;
