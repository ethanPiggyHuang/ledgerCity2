import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { timeEdit } from '../../redux/reducers/ledgerSingleSlice';

export const TimeBar: React.FC = () => {
  const ledgerTime = useAppSelector((state) => state.ledgerSingle.timeLedger);
  const dispatch = useAppDispatch();

  const time = new Date(ledgerTime);
  const timeInSeconds = time.getTime();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const scopes = [
    { scope: 'year', text: `${new Date(ledgerTime).getFullYear()}年` },
    { scope: 'month', text: `${new Date(ledgerTime).getMonth() + 1}月` },
    { scope: 'date', text: `${new Date(ledgerTime).getDate()}日` },
    { scope: 'day', text: `星期${weekdays[new Date(ledgerTime).getDay()]}` },
  ];
  const switchs = [
    { delta: -1, symbol: '▲' },
    { delta: 1, symbol: '▼' },
  ];

  useEffect(() => {
    //
  }, []);

  return (
    <Wrapper>
      {scopes.map(({ scope, text }) => (
        <DateOption key={scope}>
          <DateText> {text}</DateText>
          {scope !== 'day' ? (
            <DateSwitchs>
              {switchs.map(({ delta, symbol }, index) => (
                <DateSwitch
                  key={index}
                  onClick={() =>
                    dispatch(
                      timeEdit({
                        prevTime: timeInSeconds,
                        scope,
                        delta,
                      })
                    )
                  }
                >
                  {symbol}
                </DateSwitch>
              ))}
            </DateSwitchs>
          ) : (
            ''
          )}
        </DateOption>
      ))}
      {/* <DateOption>
        <DateText> {`${time.getMinutes()}分${time.getSeconds()}秒`}</DateText>
      </DateOption> */}
    </Wrapper>
  );
};

// type HouseProps = {
//   $zoomRatio: number;
//   $type: number;
// };

const Wrapper = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid lightblue;
`;

const DateOption = styled.div`
  height: 80%;
  width: 15%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const DateText = styled.div`
  height: 100%;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const DateSwitchs = styled.div`
  height: 100%;
  width: 10%;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const DateSwitch = styled.div`
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: lightgrey;
  cursor: pointer;
`;
