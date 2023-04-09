import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  amountKeyNumber,
  amountDelete,
  amountHoldOperator,
  amountCalculate,
  amountAllClear,
} from './ledgerSlice';

export const Calculator: React.FC = () => {
  const { amount, calculationHolder } = useAppSelector(
    (state) => state.ledgerSingle
  );
  const dispatch = useAppDispatch();

  const buttons: string[] = [
    '7',
    '8',
    '9',
    'AC',
    '4',
    '5',
    '6',
    'x',
    '1',
    '2',
    '3',
    '-',
    '0',
    '⇤',
    '=',
    '+',
  ];

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
    <>
      <AmountDisplay>
        <Currency>NT$</Currency>
        <AmountInput
          readOnly //check better choice
          value={`${thousandsSeparator(amount.number)} ${
            calculationHolder.operator
          } ${
            calculationHolder.number !== 0
              ? thousandsSeparator(calculationHolder.number)
              : ''
          }`}
          onKeyUp={(event) => {
            // console.log(event.key);
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
        <CurrencyExchange>NT$ 199</CurrencyExchange>
      </AmountDisplay>
      <CalculatorButtons>
        {buttons.map((button, index) => (
          <CalculatorButton
            key={index}
            onClick={() => {
              if (button === 'AC') {
                dispatch(amountAllClear());
              } else if (button === '⇤') {
                dispatch(amountDelete());
              } else if (button === '=') {
                dispatch(amountCalculate());
              } else if (['+', '-', 'x', '÷'].includes(button)) {
                dispatch(
                  amountHoldOperator(button as '' | '+' | '-' | 'x' | '÷')
                );
              } else {
                dispatch(amountKeyNumber(button));
              }
            }}
          >
            {button}
          </CalculatorButton>
        ))}
      </CalculatorButtons>
    </>
  );
};

// type HouseProps = {
//   $zoomRatio: number;
//   $type: number;
// };

const AmountDisplay = styled.div`
  margin: 10px auto 0;
  height: 20%;
  width: 90%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
`;

const Currency = styled.div`
  height: 80%;
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  border: 1px solid lightblue;
`;
const AmountInput = styled.input`
  height: 80%;
  width: 80%;
  padding-right: 15px;
  border: 1px solid lightblue;
  font-size: 30px;
  font-weight: bold;
  color: brown;
  text-align: right;
`;
const CurrencyExchange = styled.div`
  height: 80%;
  width: 30%;
  padding-left: 10px;
  border: 1px solid lightblue;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;
  //TODO currency exchange
`;

const CalculatorButtons = styled.div`
  margin: 10px auto 0;
  width: 90%;
  height: calc(70% + 10px);
  border: 1px solid lightblue;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
`;
const CalculatorButton = styled.div`
  height: 60px;
  width: 22%;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid lightblue;
  cursor: pointer;
`;
