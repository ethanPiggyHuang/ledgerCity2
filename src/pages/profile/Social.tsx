import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  TYPING_FRIEND_EMAIL,
  QUEST_FRIEND,
  FRIEND_REQUEST,
} from '../../redux/reducers/userInfoSlice';

export const Social: React.FC = () => {
  const { userId, friends, cityList } = useAppSelector(
    (state) => state.userInfo.data
  );
  const { cityName } = useAppSelector((state) => state.cityBasicInfo);
  const friendIds = friends.map((friend) => friend.userId);

  const dispatch = useAppDispatch();

  const { emailInput, queryResult } = useAppSelector(
    (state) => state.userInfo.editStatus
  );

  return (
    <Wrap>
      <p>輸入好友 gmail</p>
      <input
        value={emailInput}
        onChange={(event) => {
          dispatch(TYPING_FRIEND_EMAIL(event.target.value));
        }}
      />

      <button
        onClick={() => {
          dispatch(QUEST_FRIEND(emailInput));
        }}
      >
        查詢
      </button>
      <br />
      <br />
      {queryResult.length !== 0 && (
        <>
          <p>{`名字：${queryResult[0].userName}`}</p>
          <p>{`暱稱：${queryResult[0].userNickName}`}</p>
          {queryResult[0]?.userPortraitUrl && (
            <img
              src={queryResult[0].userPortraitUrl}
              alt={`portait of ${queryResult[0].userName}`}
            />
          )}
          <br />
          <button
            onClick={() => {
              const friendId = queryResult[0].userId;
              const cityId = cityList[0];
              dispatch(FRIEND_REQUEST({ friendId, cityId }));
            }}
          >
            加好友並共管城市
          </button>
          <p>{`共管城市：${cityName}`}</p>
        </>
      )}
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 20px;
  position: relative;
  // display: flex;
  gap: 20px;
`;
