import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  LOG_OUT,
  EDIT_NICKNAME_ACTIVATE,
  TYPING_NICKNAME,
  SAVE_NICKNAME,
  CITY_REDIRECTION,
  GET_CITY_NAME,
} from '../../redux/reducers/userInfoSlice';
import { SWITCH_PAGE } from '../../redux/reducers/pageControlSlice';

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
  const { cityNames } = useAppSelector(
    (state) => state.userInfo.additionalData
  );
  // const friendIds = friends.map((friend) => friend.userId);

  useEffect(() => {
    if (cityList.length !== 0) {
      cityList.forEach((cityId) => dispatch(GET_CITY_NAME(cityId)));
    }
  }, [cityList]);

  const dispatch = useAppDispatch();
  const auth = getAuth();
  const navigate = useNavigate();

  return (
    <Wrap>
      <p>我的城市：</p>
      {cityList.map((cityId) => (
        <div key={cityId}>
          <CityName
            onClick={() => {
              dispatch(CITY_REDIRECTION({ userId, cityId }));
              dispatch(SWITCH_PAGE({ userId, pageActivity: 'city' }));
            }}
          >
            {cityNames[cityId]}
          </CityName>
        </div>
      ))}
    </Wrap>
  );
};

const Wrap = styled.div`
  margin-top: 60px;
  width: 100%;
  padding: 20px;
  position: relative;
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
