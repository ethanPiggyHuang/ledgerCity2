import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { paySelectPerson, paySelectMethod } from './ledgerSlice';

export const Payment: React.FC = () => {
  const { payWho, payHow } = useAppSelector((state) => state.ledgerSingle);
  const dispatch = useAppDispatch();
  useEffect(() => {
    //TODO: onSnapshot
    // dispatch(getCityInfo());
  }, []);

  const people = ['Ethan', 'Hazel'];
  const methods: { en: 'cash' | 'creditCard' | 'mobile'; ch: string }[] = [
    { en: 'cash', ch: '現金' },
    { en: 'mobile', ch: '行動支付' },
    { en: 'creditCard', ch: '信用卡' },
  ];

  return (
    <>
      <PaymentInfo>
        <PaidByWhoText>誰買單？</PaidByWhoText>
        <PaidByWho>
          {people.map((name, index) => (
            <PersonOption
              key={name}
              $isChosen={name === payWho}
              onClick={() => {
                dispatch(paySelectPerson(name));
              }}
            >
              <Portrait />
              <Name>{name}</Name>
            </PersonOption>
          ))}
        </PaidByWho>
        <PaidHowText>支付工具</PaidHowText>
        <PaidMethods>
          {methods.map((method) => (
            <PaidMethod
              key={method.en}
              $isChosen={method.en === payHow}
              onClick={() => {
                dispatch(paySelectMethod(method.en));
              }}
            >
              {method.ch}
            </PaidMethod>
          ))}
        </PaidMethods>
      </PaymentInfo>
    </>
  );
};

type PersonOptionProps = {
  $isChosen: boolean;
};
type PaidMethodProps = {
  $isChosen: boolean;
};

const PaymentInfo = styled.div`
  margin: 10px auto 0;
  height: 35%;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  border: 1px solid lightblue;
`;
const PaidByWhoText = styled.div`
  height: 100%;
  width: 15%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const PaidByWho = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  border: 1px solid lightblue;
`;
const PersonOption = styled.div<PersonOptionProps>`
  width: 40%;
  border: 1px solid lightblue;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  cursor: pointer;
  background-color: ${({ $isChosen }) => ($isChosen ? 'lightblue' : '')};
`;
const Portrait = styled.img`
  height: 100px;
  width: 100px;
  border: 1px solid lightblue;
  background-color: white;
`;
const Name = styled.p`
  height: 20px;
  border: 1px solid lightblue;
`;
const PaidHowText = styled.div`
  height: 100%;
  width: 15%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
`;
const PaidMethods = styled.div`
  height: 100%;
  width: 15%;

  border: 1px solid lightblue;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;
const PaidMethod = styled.p<PaidMethodProps>`
  width: 100%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${({ $isChosen }) => ($isChosen ? 'lightblue' : '')};
`;
