import React from 'react';
import styled from 'styled-components/macro';
import { MEDIA_QUERY_TABLET } from '../../utils/RWDbreakpoints';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  amountKeyNumber,
  amountDelete,
  amountHoldOperator,
  amountCalculate,
  amountAllClear,
} from '../../redux/reducers/ledgerSingleSlice';

export const Calculator: React.FC = () => {
  const { calculationHolder } = useAppSelector((state) => state.ledgerSingle);
  const { amount } = useAppSelector((state) => state.ledgerSingle.data);
  const dispatch = useAppDispatch();

  const buttons: string[][] = [
    ['7', '8', '9', 'AC'],
    ['4', '5', '6', 'x'],
    ['1', '2', '3', '-'],
    ['0', '⇤', '=', '+'],
  ];

  //TODO: .的處理

  const getButtonType: (button: string) => 'number' | 'operator' | 'allClear' =
    function (button) {
      if (button === 'AC') {
        return 'allClear';
      } else if (['+', '-', 'x', '÷', '=', '⇤'].includes(button)) {
        return 'operator';
      } else {
        return 'number';
      }
    };

  return (
    <Wrapper>
      <CalculatorButtons>
        {buttons.map((row, rowIndex) => (
          <ButtonRow key={rowIndex}>
            {row.map((button, index) => (
              <CalculatorButton
                key={`${rowIndex + index}`}
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
                $buttonType={getButtonType(button)}
              >
                {button}
              </CalculatorButton>
            ))}
          </ButtonRow>
        ))}
      </CalculatorButtons>
    </Wrapper>
  );
};

type CalculatorButtonProps = {
  $buttonType: 'number' | 'operator' | 'allClear';
};

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  background-color: #292929;
  width: 100%;
  padding: 0 80px;
  height: 35%;
  ${MEDIA_QUERY_TABLET} {
    padding: 0 50px;
  }
`;

const CalculatorButtons = styled.div`
  height: 100%;
`;
const ButtonRow = styled.div`
  height: 25%;
  display: flex;
  justify-content: space-between;
`;

const CalculatorButton = styled.button<CalculatorButtonProps>`
  height: 100%;
  margin: 5px 2%;
  width: 20%;
  color: ${({ $buttonType }) =>
    $buttonType === 'number' ? '#f2f2f2' : '#dabd7a'};
  font-size: 28px;
  background-color: #00000000;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    border: #f2f2f2 3px solid;
    background-color: ${({ $buttonType }) =>
      $buttonType === 'allClear' ? '#610000' : '#00000000'};
  }
  &:active {
    transform: translateY(3px);
  }

  ${MEDIA_QUERY_TABLET} {
    height: 80%;
    font-size: 24px;
  }
`;
