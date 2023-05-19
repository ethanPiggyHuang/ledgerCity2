import {
  faCalendarDay,
  faCaretLeft,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  SET_CURRENT_TIME,
  SWITCH_TIME,
} from '../../redux/reducers/ledgerSingleSlice';
import { semantizeDate } from '../../utils/timeDisplay';

export const TimeBar: React.FC = () => {
  const ledgerTime = useAppSelector(
    (state) => state.ledgerSingle.data.timeLedger
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (ledgerTime === 0) {
      const nowInSeconds = new Date().getTime();
      dispatch(SET_CURRENT_TIME(nowInSeconds));
    }
  }, []);

  const time = new Date(ledgerTime);
  const timeInSeconds = time.getTime();

  return (
    <Wrapper>
      <DateSwitch
        onClick={() =>
          dispatch(
            SWITCH_TIME({
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
            SWITCH_TIME({
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
            dispatch(SET_CURRENT_TIME(nowInSeconds));
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
