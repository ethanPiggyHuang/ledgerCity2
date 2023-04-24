import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { GET_COOP_FRIEND_ACTIVITY } from '../../redux/reducers/usersActivitySlice';
import { getAuth, signOut } from 'firebase/auth';
import { redirect, useNavigate } from 'react-router-dom';
import {
  LOG_OUT,
  EDIT_NICKNAME_ACTIVATE,
  TYPING_NICKNAME,
  SAVE_NICKNAME,
  CITY_REDIRECTION,
} from '../../redux/reducers/userInfoSlice';

export const Account: React.FC = () => {
  const {
    userId,
    userName,
    userNickName,
    userEmail,
    userPortraitUrl,
    cityList,
  } = useAppSelector((state) => state.userInfo.data);
  const { isNickNameEdit, inputText } = useAppSelector(
    (state) => state.userInfo.editStatus
  );
  // const friendIds = friends.map((friend) => friend.userId);

  const dispatch = useAppDispatch();
  const auth = getAuth();
  const navigate = useNavigate();

  return (
    <Wrap>
      <p>{`ID: ${userId}`}</p>
      <p>{`名字: ${userName}`}</p>
      <p>{`暱稱:`}</p>
      {isNickNameEdit ? (
        <NickNameInput
          value={inputText}
          onChange={(event) => {
            dispatch(TYPING_NICKNAME(event.target.value));
          }}
        />
      ) : (
        <span> {userNickName}</span>
      )}
      <span
        onClick={() => {
          if (isNickNameEdit) {
            dispatch(SAVE_NICKNAME(inputText));
          } else {
            const initialValue = userNickName || '';
            dispatch(EDIT_NICKNAME_ACTIVATE(initialValue));
          }
        }}
      >
        {isNickNameEdit ? '儲存暱稱' : '修改暱稱'}
      </span>
      <p>{`email: ${userEmail}`}</p>
      {userPortraitUrl && (
        <img src={userPortraitUrl} alt={`portrait of ${userName}`} />
      )}
      <br />
      <button
        onClick={() => {
          signOut(auth);
          dispatch(LOG_OUT());
          navigate('./city');
        }}
      >
        Sign out
      </button>
      <br />
      <br />
      <p>我的城市：</p>
      {cityList.map((cityId) => (
        <div key={cityId}>
          <CityName
            onClick={() => {
              dispatch(CITY_REDIRECTION({ userId, cityId }));
            }}
          >
            {cityId}
          </CityName>
        </div>
      ))}
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  // height: 100vh;
  padding: 20px;
  position: relative;
  // display: flex;
  gap: 20px;
`;

const NickNameInput = styled.input`
  padding-right: 15px;
  border: 1px solid lightblue;
  font-size: 20px;
  margin-left: auto;
  text-align: left;
`;

const CityName = styled.p`
  &:hover {
    cursor: pointer;
    background-color: lightblue;
  }
`;
