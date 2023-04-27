import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getAuth, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightFromBracket,
  faFloppyDisk,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
  PANEL_CONTROL,
  SWITCH_PAGE,
} from '../../redux/reducers/pageControlSlice';
import { ClosingButton } from '../../component/ClosingButton';
import {
  LOG_OUT,
  EDIT_NICKNAME_SWITCH,
  TYPING_NICKNAME,
  SAVE_NICKNAME,
  CITY_REDIRECTION,
  GET_CITY_NAME,
} from '../../redux/reducers/userInfoSlice';
import { useNavigate } from 'react-router-dom';
import banner from '../../assets/banner.png';

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
              onClick={() => dispatch(EDIT_NICKNAME_SWITCH(true))}
              onBlur={() => dispatch(EDIT_NICKNAME_SWITCH(false))}
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

          <AccountText onClick={() => {}}>{userEmail}</AccountText>
        </AccountTextWrap>
      </AccountBasicWrap>
      <MyCitiesWrap>
        <MyCitiesText>{`我的城市：`}</MyCitiesText>
        {cityList.map((cityId) => (
          <MyCityWrap>
            <BannerWrap>
              <MyCityText>{cityNames[cityId]}</MyCityText>
              <MyCityNoticeWrap
                onClick={() => {
                  dispatch(CITY_REDIRECTION({ userId, cityId }));
                  dispatch(SWITCH_PAGE({ userId, pageActivity: 'city' }));
                }}
              >
                <MyCityNotice>前往</MyCityNotice>
              </MyCityNoticeWrap>
            </BannerWrap>
          </MyCityWrap>
        ))}
      </MyCitiesWrap>
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
      <CrossIconWrap onClick={() => dispatch(PANEL_CONTROL('none'))}>
        <CrossIcon icon={faXmark} />
      </CrossIconWrap>
    </Wrap>
  );
};

const Wrap = styled.div`
  /* height: 20vh; */
  position: absolute;
  width: 30vw;
  top: 80px;
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
  margin-left: 10px;
  font-size: 20px;
  color: #808080;
  cursor: pointer;
  display: inline;
`;

const MyCitiesWrap = styled.div`
  height: 100px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MyCitiesText = styled.p`
  font-size: 18px;
  color: #ae7a00;
  padding: 10px;
  display: flex;
  gap: 17px;
`;

const MyCityWrap = styled.div`
  font-size: 18px;
  color: #ae7a00;
  display: flex;
  padding-left: 10px;
  gap: 17px;
`;

const BannerWrap = styled.div`
  padding: 0 40px;
  height: 36px;
  /* overflow: hidden; */
  display: flex;
  justify-content: center;
  background-image: url(${banner});
  background-size: 100% 100%;
  border-radius: 5px;
  position: relative;
  cursor: pointer;
`;

const MyCityText = styled.div`
  font-size: 18px;
  color: #ae7a00;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MyCityNoticeWrap = styled.div`
  /* font-size: 18px; */
  /* line-height: 36px; */
  width: 100%;
  height: 100%;
  color: #ae7a00;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  opacity: 0;
  padding-left: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;

const MyCityNotice = styled.div`
  font-size: 14px;
  margin-right: 3px;
  line-height: 20px;
  border-radius: 5px;
  padding: 3px;
  color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: #ae7a00;
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
  font-size: 16px;
  color: #f2f2f2;
  &:hover {
    opacity: 0.7;
  }
`;

const CrossIconWrap = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  padding: 10px;

  height: 20px;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const CrossIcon = styled(FontAwesomeIcon)`
  color: #808080;
`;
