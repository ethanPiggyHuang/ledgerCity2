import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  TYPING_FRIEND_EMAIL,
  QUEST_FRIEND,
  FRIEND_REQUEST,
} from '../../redux/reducers/userInfoSlice';
import {
  GET_FRIENDS_INFO,
  AGREE_COOPERATIONS,
} from '../../redux/reducers/usersActivitySlice';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const Social: React.FC = () => {
  const { userId, cityList } = useAppSelector((state) => state.userInfo.data);
  const { friends } = useAppSelector((state) => state.userInfo);
  const { cityName } = useAppSelector((state) => state.cityBasicInfo);
  const { friendsInfo } = useAppSelector((state) => state.userActivity);
  const friendIds = friends.map((friend) => friend.userId);

  useEffect(() => {
    if (friends.length !== 0) {
      friendIds.forEach((friendId) => {
        dispatch(GET_FRIENDS_INFO(friendId));
        console.log(friends);
      });
    }
  }, [friends]);

  const dispatch = useAppDispatch();

  const { emailInput, queryResult } = useAppSelector(
    (state) => state.userInfo.editStatus
  );

  const friendsArray = Object.values(friendsInfo);

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
      <p>＊＊朋友清單＊＊</p>
      {friendsArray.length !== 0 &&
        friendsArray.map((friend, index) => (
          <div key={index}>
            <p>{`朋友名字：${friend.userName}`}</p>
            <span>{`/朋友狀態：${
              friends.find((user) => user.userId === friend.userId)
                ?.friendStatus
            }`}</span>
            {friends.find((user) => user.userId === friend.userId)
              ?.friendStatus === 'beenInvited' && <button>同意邀請</button>}
            <br />
            <span>{`/協作狀態：${
              friends.find((user) => user.userId === friend.userId)?.coopStatus
            }`}</span>
            {friends.find((user) => user.userId === friend.userId)
              ?.friendStatus === 'beenInvited' && (
              <button
                onClick={() => {
                  const friendId = friend.userId;
                  const cityId = friends.find(
                    (user) => user.userId === friend.userId
                  )?.coopCityId;
                  if (cityId) {
                    dispatch(AGREE_COOPERATIONS({ userId, friendId, cityId }));
                  }
                }}
              >
                同意邀請
              </button>
            )}
          </div>
        ))}
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100vw;
  // height: 100vh;
  padding: 20px;
  position: relative;
  // display: flex;
  gap: 20px;
`;
