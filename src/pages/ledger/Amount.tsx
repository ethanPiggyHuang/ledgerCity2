import React from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import {
  amountAllClear,
  amountCalculate,
  amountDelete,
  amountKeyNumber,
} from '../../redux/reducers/ledgerSingleSlice';

export const Amount: React.FC = () => {
  const { number } = useAppSelector((state) => state.ledgerSingle.data.amount);
  const { operator } = useAppSelector(
    (state) => state.ledgerSingle.calculationHolder
  );
  const numberAfterOperator = useAppSelector(
    (state) => state.ledgerSingle.calculationHolder.number
  );

  const dispatch = useAppDispatch();

  const thousandsSeparator: (number: number) => string = function (number) {
    const parts = number.toString().split('.');
    const numberPart = parts[0];
    const decimalPart = parts[1];
    const thousands = /\B(?=(\d{3})+(?!\d))/g;
    return (
      numberPart.replace(thousands, ',') +
      (decimalPart ? '.' + decimalPart : '')
    );
  };

  return (
    <AmountDisplay>
      <Currency>NT$</Currency>
      <AmountInput
        readOnly //check better choice
        value={`${thousandsSeparator(number)} ${operator} ${
          numberAfterOperator !== 0
            ? thousandsSeparator(numberAfterOperator)
            : ''
        }`}
        onKeyUp={(event) => {
          const numberRegex: RegExp = /^\d+$/;
          if (event.key === 'Escape') {
            dispatch(amountAllClear());
          } else if (event.key === 'Backspace') {
            dispatch(amountDelete());
          } else if (event.key === 'Enter') {
            dispatch(amountCalculate());
          } else if (numberRegex.test(event.key)) {
            dispatch(amountKeyNumber(event.key));
          } //TODO: allow operators
        }}
      />
    </AmountDisplay>
  );

  return <AmountText>{`$ ${number}`}</AmountText>;
};

const AmountText = styled.p`
  height: 10%;
  margin: 0 15px;
  font-size: 28px;
  display: flex;
  align-items: center;
  color: #dabd7a;
  background-color: #f2f2f2;
`;

const AmountDisplay = styled.div`
  margin: 0 15px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #dabd7a;
`;

const Currency = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  line-height: 28px;
`;
const AmountInput = styled.input`
  height: 100%;
  width: 80%;
  border: none;
  font-size: 28px;
  font-weight: bold;
  color: #dabd7a;
  text-align: right;
  background-color: rgba(0, 0, 0, 0);
`;
