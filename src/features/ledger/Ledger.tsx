import React, { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import styled from 'styled-components/macro';

export const Ledger: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    //TODO: onSnapshot
    // dispatch(getCityInfo());
  }, []);
  // const time: DateConstructor = new Date();

  const labelArray: string[] = new Array(10).fill('');
  const CaculatorButtons: (number | string)[] = [
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
    <Wrap>
      <ModeOptions>
        <ModeOption>a</ModeOption>
        <ModeOption>b</ModeOption>
        <ModeOption>c</ModeOption>
      </ModeOptions>
      <MainBoard>
        <DateBar>
          <DateSwitch></DateSwitch>
          <Date>{}</Date>
          <DateSwitch></DateSwitch>
        </DateBar>
        <Section>
          <ItemDisplay>
            <LabelChosens>
              <LabelChosen>食物</LabelChosen>
              <LabelChosen>午餐</LabelChosen>
              <LabelChosen>普通</LabelChosen>
            </LabelChosens>
            <ItemInput></ItemInput>
          </ItemDisplay>
          <LabelOptions>
            <LabelTypes>
              <LabelType>主要標籤</LabelType>
              <LabelType>次要標籤</LabelType>
            </LabelTypes>
            <Labels>
              {labelArray.map((label) => (
                <Label></Label>
              ))}
            </Labels>
          </LabelOptions>
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
              <PaidMethod>現金</PaidMethod>
              <PaidMethod>信用卡</PaidMethod>
            </PaidMethods>
          </PaymentInfo>
        </Section>
        <Section>
          <AmountDisplay>
            <Currency>NT$</Currency>
            <AmountInput></AmountInput>
            <CurrencyExchange>NT$ 199</CurrencyExchange>
          </AmountDisplay>
          <Calculator>
            {CaculatorButtons.map((symbol) => (
              <CalculatorButton>{symbol}</CalculatorButton>
            ))}
          </Calculator>
        </Section>
        <BoardFooter>
          <RecordPerson>{`記錄者：${'Ethan'}`}</RecordPerson>
          <ConfirmButton>確認</ConfirmButton>
        </BoardFooter>
      </MainBoard>
    </Wrap>
  );
};

// type HouseProps = {
//   $zoomRatio: number;
//   $type: number;
// };

const Wrap = styled.div`
  padding: 20px;
  position: relative;
  display: flex;
  border: 1px solid lightblue;
  flex-wrap: wrap;
  gap: 20px;
`;

const ModeOptions = styled.div`
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 1px solid lightblue;
`;

const ModeOption = styled.div`
  width: 30%;
  border: 1px solid lightblue;
`;

const MainBoard = styled.div`
  width: 100%;
  border: 1px solid lightblue;
  display: flex;
  flex-wrap: wrap;
`;
const DateBar = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  border: 1px solid lightblue;
`;
const DateSwitch = styled.div`
  width: 10%;
  border: 1px solid lightblue;
`;
const Date = styled.div`
  width: 100%;
  border: 1px solid lightblue;
`;
const Section = styled.div`
  height: 450px;
  width: 50%;
  border: 1px solid lightblue;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // gap: 20px;
`;
const ItemDisplay = styled.div`
  margin: 10px auto 0;
  height: 20%;
  width: 90%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
`;

const LabelChosens = styled.div`
  height: 80%;
  width: 20%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 5px;
`;
const LabelChosen = styled.div`
  width: 50px;
  height: 25px;
  border-radius: 5px;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ItemInput = styled.input`
  height: 80%;
  width: 75%;
  padding-left: 10px;
  border: 1px solid lightblue;
  font-size: 20px;
  margin-left: auto;
`;

const LabelOptions = styled(ItemDisplay)`
  height: 35%;
  display: flex;
  justify-content: left;
  border: 1px solid lightblue;
`;
const LabelTypes = styled.div`
  height: 90%;
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  border: 1px solid lightblue;
`;
const LabelType = styled.div`
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border: 1px solid lightblue;
`;
const Labels = styled.div`
  height: 90%;
  width: 75%;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 10px;
  border: 1px solid lightblue;
  margin-left: auto;
  padding: 10px 20px;
`;
const Label = styled.div`
  height: 45px;
  width: 45px;
  border: 1px solid lightblue;
  margin-top: auto;
`;
const PaymentInfo = styled(ItemDisplay)`
  height: 35%;
  display: flex;
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
const AmountDisplay = styled(ItemDisplay)``;

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

const Calculator = styled(ItemDisplay)`
  height: calc(70% + 10px);
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
`;
const CalculatorButton = styled.div`
  height: 60px;
  width: 22%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid lightblue;
`;

const BoardFooter = styled.div`
  height: 80px;
  width: 100%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const RecordPerson = styled.div`
  height: 80%;
  width: 20%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ConfirmButton = styled.div`
  height: 80%;
  width: 75%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
`;
