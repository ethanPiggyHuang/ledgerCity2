import React, { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import styled from 'styled-components/macro';
import { Calculator } from './Calculator';
import { Label } from './Label';

export const Payment: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    //TODO: onSnapshot
    // dispatch(getCityInfo());
  }, []);
  // const time: DateConstructor = new Date();

  const methods: string[] = ['現金', '行動支付', '信用卡'];

  return (
    <>
      <PaymentInfo>
        <PaidByWhoText>誰買單？</PaidByWhoText>
        <PaidByWho>
          <PersonOption>
            <Portrait />
            <Name>Ethan</Name>
          </PersonOption>
          <PersonOption>
            <Portrait />
            <Name>Hazel</Name>
          </PersonOption>
        </PaidByWho>
        <PaidHowText>支付工具</PaidHowText>
        <PaidMethods>
          {methods.map((method) => (
            <PaidMethod key={method}>{method}</PaidMethod>
          ))}
        </PaidMethods>
      </PaymentInfo>
    </>
  );
};

// type HouseProps = {
//   $zoomRatio: number;
//   $type: number;
// };

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
const PersonOption = styled.div`
  width: 40%;
  border: 1px solid lightblue;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;
const Portrait = styled.img`
  height: 100px;
  width: 100px;
  border: 1px solid lightblue;
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
const PaidMethod = styled.p`
  width: 100%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
`;
