import React, { useEffect } from 'react';
import styled from 'styled-components/macro';

interface Props {
  payload: {
    userPortraitUrl: string;
    userNickName: string;
    userEmail: string;
    lastActiveTime: number;
  };
}

export const UserBasics: React.FC<Props> = ({ payload }) => {
  const { userPortraitUrl, userNickName, userEmail, lastActiveTime } = payload;
  const lastActiveDate = (timeInSecond: number): string => {
    const currentInSecond = new Date().getTime();
    const result = Math.round((currentInSecond / 1000 - timeInSecond) / 86400);
    if (timeInSecond === 0) {
      return '暫無資料';
    } else if (result < 1) {
      return '今日';
    }
    return `${result}日前`;
  };
  return (
    <>
      <FriendPorTraitWrap>
        <FriendPorTrait src={userPortraitUrl} />
      </FriendPorTraitWrap>
      <FriendInfoTextWrap>
        <FriendInfoText>{userNickName}</FriendInfoText>
        <FriendInfoTextMinor>{userEmail}</FriendInfoTextMinor>
        <FriendInfoTextMinor>{`最近活躍：${lastActiveDate(
          lastActiveTime
        )}`}</FriendInfoTextMinor>
      </FriendInfoTextWrap>
    </>
  );
};

const FriendPorTraitWrap = styled.div`
  height: 55px;
  width: 55px;
  border-radius: 50%;
  border: 3px rgba(128, 128, 128, 0.6) solid;
  overflow: hidden;
`;

const FriendPorTrait = styled.img`
  height: 100%;
  object-fit: contain;
`;

const FriendInfoTextWrap = styled.div`
  width: 35%;
  height: 100%;
  padding-top: 5px;
  display: flex;
  flex-direction: column;
`;
const FriendInfoText = styled.p`
  margin-bottom: auto;
`;
const FriendInfoTextMinor = styled.p`
  font-size: 12px;
  opacity: 0.6;
  padding-top: 3px;
`;
