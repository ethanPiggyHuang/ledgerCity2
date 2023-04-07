import React, { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import styled from 'styled-components/macro';

export const Calculator: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    //TODO: onSnapshot
    // dispatch(getCityInfo());
  }, []);
  // const time: DateConstructor = new Date();

  const buttons: (number | string)[] = [
    7,
    8,
    9,
    '-',
    4,
    5,
    6,
    'x',
    1,
    2,
    3,
    '÷',
    0,
    '+',
    '=',
    '<-',
  ];

  return (
    <>
      <AmountDisplay>
        <Currency>NT$</Currency>
        <AmountInput></AmountInput>
        <CurrencyExchange>NT$ 199</CurrencyExchange>
      </AmountDisplay>
      <CalculatorButtons>
        {buttons.map((button, index) => (
          <CalculatorButton key={index}>{button}</CalculatorButton>
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
  padding-left: 10px;
  border: 1px solid lightblue;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
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
  // display: none;
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
`;
