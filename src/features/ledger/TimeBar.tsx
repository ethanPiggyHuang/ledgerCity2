import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  timeEdit,
  TIME_INITIALIZE,
} from '../../redux/reducers/ledgerSingleSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay,
  faCaretLeft,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons';

const semantizeDate = (displayTime: number) => {
  const today = new Date();
  const time = new Date(displayTime);
  const dateDiff = today.getDate() - time.getDate();
  const secondDiff = Math.abs(today.getTime() - time.getTime()) / 1000;
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  if (dateDiff === 0 && secondDiff <= 86400) {
    return '今天';
  } else if (dateDiff === 1 && secondDiff <= 86400 * 2) {
    return '昨天';
  } else if (dateDiff === 2 && secondDiff <= 86400 * 3) {
    return '前天';
  } else {
    return `${time.getMonth() + 1} / ${time.getDate()} (${
      weekdays[time.getDay()]
    })`;
  }
};

export const TimeBar: React.FC = () => {
  const ledgerTime = useAppSelector(
    (state) => state.ledgerSingle.data.timeLedger
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (ledgerTime === 0) {
      const nowInSeconds = new Date().getTime();
      dispatch(TIME_INITIALIZE(nowInSeconds));
    }
  }, []);

  const time = new Date(ledgerTime);
  const timeInSeconds = time.getTime();

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
      <DateText>{semantizeDate(ledgerTime)}</DateText>
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

      {semantizeDate(ledgerTime) !== '今天' && (
        <TodayWrap
          onClick={() => {
            const nowInSeconds = new Date().getTime();
            dispatch(TIME_INITIALIZE(nowInSeconds));
          }}
        >
          <TodayIcon icon={faCalendarDay} />
          <TodayText>今天</TodayText>
        </TodayWrap>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 40px;
  width: 260px;
  border-radius: 20px;
  color: #dabd7a;

  background-color: #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
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
  font-size: 20px;
  cursor: pointer;
`;

const TodayWrap = styled.div`
  cursor: pointer;
  height: 100%;
  position: absolute;
  right: -30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
`;

const TodayText = styled.p`
  font-size: 12px;
  transform: scale(0.9);
`;

const TodayIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
`;
