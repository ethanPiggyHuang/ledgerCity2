import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  timeEdit,
  timeInitialize,
} from '../../redux/reducers/ledgerSingleSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

export const TimeBar: React.FC = () => {
  const ledgerTime = useAppSelector(
    (state) => state.ledgerSingle.data.timeLedger
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (ledgerTime === 0) {
      const nowInSeconds = new Date().getTime();
      dispatch(timeInitialize(nowInSeconds));
    }
  }, []);

  const today = new Date();

  const time = new Date(ledgerTime);
  const timeInSeconds = time.getTime();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const scopes = [
    // { scope: 'year', text: `${new Date(ledgerTime).getFullYear()}年` },
    // { scope: 'month', text: `${new Date(ledgerTime).getMonth() + 1}月` },
    // { scope: 'date',  text: `${new Date(ledgerTime).getDate()} 日` },
    // { scope: 'day', text: `星期${weekdays[new Date(ledgerTime).getDay()]}` },
  ];

  const text =
    today.getDate() === new Date(ledgerTime).getDate() &&
    Math.abs(today.getTime() - time.getTime()) < 86400 * 1000
      ? '今日'
      : `${time.getMonth() + 1} / ${time.getDate()}`;

  return (
    <Wrapper>
      <DateSwitch
        onClick={() =>
          dispatch(
            timeEdit({
              prevTime: timeInSeconds,
              scope: 'date',
              delta: -1,
            })
          )
        }
        icon={faCaretLeft}
      />
      <DateText>{text}</DateText>
      <DateSwitch
        onClick={() =>
          dispatch(
            timeEdit({
              prevTime: timeInSeconds,
              scope: 'date',
              delta: 1,
            })
          )
        }
        icon={faCaretRight}
      />

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
  height: 40px;
  width: 200px;
  border-radius: 20px;
  color: #dabd7a;

  background-color: #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DateText = styled.div`
  height: 100%;
  width: 80%;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DateSwitch = styled(FontAwesomeIcon)`
  height: 20px;
`;
