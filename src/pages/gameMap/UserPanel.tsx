import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getAuth, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightFromBracket,
  faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';
import { SWITCH_PAGE } from '../../redux/reducers/pageControlSlice';
import { ClosingButton } from '../../component/ClosingButton';
import {
  LOG_OUT,
  EDIT_NICKNAME_ACTIVATE,
  TYPING_NICKNAME,
  SAVE_NICKNAME,
  CITY_REDIRECTION,
  GET_CITY_NAME,
} from '../../redux/reducers/userInfoSlice';
import { useNavigate } from 'react-router-dom';

export const UserPanel: React.FC = () => {
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
  const auth = getAuth();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (cityList.length !== 0) {
      cityList.forEach((cityId) => dispatch(GET_CITY_NAME(cityId)));
    }
  }, [cityList]);

  useEffect(() => {
    dispatch(TYPING_NICKNAME(userNickName));
  }, []);

  return (
    <Wrap>
      <AccountBasicWrap>
        {userPortraitUrl && (
          <PorTraitWrap>
            <PorTrait src={userPortraitUrl} alt={`portrait of ${userName}`} />
          </PorTraitWrap>
        )}

        <AccountTextWrap>
          <NickNameWrap>
            <NickNameInput
              value={inputText}
              onChange={(event) => {
                dispatch(TYPING_NICKNAME(event.target.value));
              }}
              onClick={() => {
                dispatch(EDIT_NICKNAME_ACTIVATE());
              }}
            />
            {isNickNameEdit && (
              <SaveIcon
                icon={faFloppyDisk}
                onClick={() => {
                  dispatch(SAVE_NICKNAME(inputText));
                }}
              />
            )}
          </NickNameWrap>

          <AccountText>{userEmail}</AccountText>
        </AccountTextWrap>
      </AccountBasicWrap>

      <IconBack
        onClick={() => {
          signOut(auth);
          dispatch(LOG_OUT());
          navigate('./city');
        }}
      >
        <LeaveIcon icon={faRightFromBracket} />
        <IconText>登出</IconText>
      </IconBack>
    </Wrap>
  );
};

const Wrap = styled.div`
  /* height: 20vh; */
  width: 30vw;
  left: 50px;
  top: 180px;
  display: flex;
  flex-direction: column;
  gap: 17px;

  border: #ffffff 3px solid;
  background-color: #f7f7f7;

  border-radius: 20px;
`;

const AccountBasicWrap = styled.div`
  height: 100px;
  padding: 10px;
  display: flex;
  gap: 17px;
`;

const PorTraitWrap = styled.div`
  height: 80px;
  width: 80px;
  border-radius: 50%;
  border: 3px rgba(128, 128, 128, 0.6) solid;
  overflow: hidden;
  cursor: pointer;
`;

const PorTrait = styled.img`
  height: 100%;
  object-fit: contain;
`;

const AccountTextWrap = styled.p`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /* gap: 17px; */
  padding: 10px 0;
`;

const AccountText = styled.span`
  color: #808080;
`;
const NickNameWrap = styled.div``;
const NickNameInput = styled.input`
  padding-right: 15px;
  font-size: 16px;
  background-color: #f7f7f7;
  color: #808080;
  width: 100px;
  display: inline;

  &:focus {
    border-bottom: 2px solid #808080;
  }
  &:hover {
    border-bottom: 2px solid #808080;
  }
  &:focus:hover {
    border-bottom: 2px solid #808080;
  }
`;

const SaveIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  /* position: absolute;
  bottom: 5px;
  right: 5px; */
  color: #df9469;
  cursor: pointer;
  display: inline;
`;

const IconBack = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  opacity: 0.5;
  cursor: pointer;
  margin: 0 10px 10px auto;
  &:hover {
    opacity: 0.7;
  }
`;

const IconText = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 33px;
  position: absolute;
  background-color: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  &:hover {
    opacity: 0.8;
  }
`;

const LeaveIcon = styled(FontAwesomeIcon)`
  font-size: 30px;
  color: #f2f2f2;
  &:hover {
    opacity: 0.7;
  }
`;
