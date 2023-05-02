import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getAuth, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightFromBracket,
  faFloppyDisk,
  faXmark,
  faCirclePlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  PANEL_CONTROL,
  SWITCH_PAGE,
} from '../../redux/reducers/pageControlSlice';
import {
  LOG_OUT,
  EDIT_NICKNAME_SWITCH,
  TYPING_NICKNAME,
  SAVE_NICKNAME,
  CITY_REDIRECTION,
  GET_CITY_NAME,
  CREATE_NEW_CITY,
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
    dispatch(TYPING_NICKNAME(userNickName));
  }, []);

  return (
    <Wrap>
      <AccountBasicWrap>
        <PorTraitWrap>
          <PorTrait src={userPortraitUrl} alt={`portrait of ${userNickName}`} />
        </PorTraitWrap>
        <AccountTextWrap>
          <NickNameWrap>
            <NickNameInput
              value={inputText}
              onChange={(event) => {
                dispatch(TYPING_NICKNAME(event.target.value));
              }}
              onClick={() => dispatch(EDIT_NICKNAME_SWITCH(true))}
              onBlur={() =>
                setTimeout(() => dispatch(EDIT_NICKNAME_SWITCH(false)), 100)
              }
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
        {cityList.map((cityId, index) => (
          <MyCityWrap key={cityId}>
            <CityBannerWrap>
              <MyCityText>{cityNames[cityId]}</MyCityText>
              <MyCityNoticeWrap
                onClick={() => {
                  if (index === 0) return;
                  dispatch(CITY_REDIRECTION({ userId, cityId }));
                  dispatch(SWITCH_PAGE({ userId, pageActivity: 'city' }));
                  dispatch(PANEL_CONTROL('none'));
                }}
              >
                <MyCityNotice>{index === 0 ? '目前' : '前往'}</MyCityNotice>
              </MyCityNoticeWrap>
            </CityBannerWrap>
          </MyCityWrap>
        ))}
        {cityList.length < 2 && (
          <MyCityWrap>
            <AddNewCityWrap
              onClick={() => {
                alert('注意，每個帳號最多只能擁有兩座城市，請細心管理 :D');
                //need double confirm
                dispatch(CREATE_NEW_CITY(userId));
              }}
            >
              <AddNewIcon icon={faCirclePlus} />
            </AddNewCityWrap>
          </MyCityWrap>
        )}
      </MyCitiesWrap>
      <IconBack
        onClick={() => {
          dispatch(PANEL_CONTROL('none'));
          signOut(auth);
          dispatch(LOG_OUT());
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
  padding: 20px 0 0 20px;
  display: flex;
  gap: 17px;
`;

const PorTraitWrap = styled.div`
  height: 80px;
  width: 80px;
  border-radius: 50%;
  border: 3px rgba(128, 128, 128, 0.6) solid;
  overflow: hidden;
`;

const PorTrait = styled.img`
  height: 100%;
  object-fit: contain;
`;

const AccountTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /* gap: 17px; */
  padding: 10px 0;
`;

const AccountText = styled.span`
  color: #808080;
  font-size: 14px;
  opacity: 0.6;
`;
const NickNameWrap = styled.div``;
const NickNameInput = styled.input`
  padding-right: 15px;
  font-size: 18px;
  background-color: #f7f7f7;
  color: #808080;
  width: 100px;
  display: inline;
  border-bottom: 2px solid rgba(0, 0, 0, 0);

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
  /* font-size: 10px; */
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

const CityBannerWrap = styled.div`
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

const AddNewCityWrap = styled(CityBannerWrap)`
  border: 1.5px dashed #ae7a00;
  background-image: none;
  width: 152px;
  align-items: center;
  opacity: 0;
  transition: opacity 0.8s ease;
  &:hover {
    opacity: 0.5;
  }
`;

const AddNewIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
  color: #ae7a00;
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
  transition: opacity 0.8s ease;

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
  background-color: darkred;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 0.9;
  }
`;

const LeaveIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
  color: #f2f2f2;
  /* &:hover {
    opacity: 0;
  } */
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
