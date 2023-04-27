import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  CITY_REDIRECTION,
  GET_CITY_NAME,
} from '../../redux/reducers/userInfoSlice';
import {
  GET_FRIENDS_INFO,
  AGREE_COOPERATIONS,
} from '../../redux/reducers/usersActivitySlice';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ClosingButton } from '../../component/ClosingButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { SWITCH_PAGE } from '../../redux/reducers/pageControlSlice';
import banner from '../../assets/banner.png';
import { VISIT_CITY } from '../../redux/reducers/cityBasicInfoSlice';

export const Social: React.FC = () => {
  const { userId, cityList } = useAppSelector((state) => state.userInfo.data);
  const { friends } = useAppSelector((state) => state.userInfo);
  const { cityName } = useAppSelector((state) => state.cityBasicInfo);
  const { cityNames } = useAppSelector(
    (state) => state.userInfo.additionalData
  );
  const { friendsInfo, coopInfo } = useAppSelector(
    (state) => state.userActivity
  );
  const { pageActivity } = useAppSelector((state) => state.pageControl);
  const currentCityId = cityList[0];

  const friendIds = friends.map((friend) => friend.userId);

  const lastActiveDate = (timeInSecond: number): string => {
    const currentInSecond = new Date().getTime();
    const result = Math.round((currentInSecond / 1000 - timeInSecond) / 86400);
    if (result < 1) {
      return '今日';
    }
    return `${result}日前`;
  };

  useEffect(() => {
    if (friends.length !== 0) {
      friendIds.forEach((friendId) => {
        dispatch(GET_FRIENDS_INFO(friendId));
      });
    }
  }, [friends]);

  useEffect(() => {
    const friendIds = Object.keys(friendsInfo);
    if (friendIds.length !== 0) {
      const allFriendsCityId = friendIds
        .map((friendId) => friendsInfo[friendId].cityList)
        .flat();
      // console.log(allFriendsCityId);
      allFriendsCityId.forEach((cityId) => dispatch(GET_CITY_NAME(cityId)));
    }
  }, [friendsInfo]);

  const dispatch = useAppDispatch();

  const { emailInput, queryResult } = useAppSelector(
    (state) => state.userInfo.editStatus
  );

  const friendsArray = Object.values(friendsInfo);

  const friendInfoCollection = friendsArray.map((friendInfo) => {
    const friendId = friendInfo.userId;
    const friendCityList = friendInfo.cityList;
    const coopCityId =
      friends.find((data) => data.userId === friendId)?.coopCityId || '';
    const personalCityId =
      friendCityList.find((data) => data !== coopCityId) || '';
    return {
      ...friendInfo,
      lastActiveTime: coopInfo[friendId]?.latestActiveTimeSecond || 0,
      coopCityId,
      coopCityName: cityNames[coopCityId] || '',
      personalCityId,
      personalCityName: cityNames[personalCityId] || '',
    };
  });

  return (
    <Wrap $isShown={pageActivity === 'profile'}>
      <HeaderRow>
        <ClosingButton size={50} />
        <SocialIcon icon={faUsers} />
        <HeaderText>協作</HeaderText>
      </HeaderRow>
      <FriendListsWrap>
        <FriendListWrap>
          <FriendListTitle>協作好友清單</FriendListTitle>
          {friendInfoCollection.length !== 0 &&
            friendInfoCollection.map((friendInfo, index) => (
              <FriendInfo key={friendInfo.userId}>
                <FriendPorTraitWrap>
                  <FriendPorTrait src={friendInfo.userPortraitUrl} />
                </FriendPorTraitWrap>
                <FriendInfoTextWrap>
                  <FriendInfoText>{friendInfo.userNickName}</FriendInfoText>
                  <FriendInfoTextMinor>
                    {friendInfo.userEmail}
                  </FriendInfoTextMinor>
                  <FriendInfoTextMinor>{`最近活躍：${lastActiveDate(
                    friendInfo.lastActiveTime
                  )}`}</FriendInfoTextMinor>
                </FriendInfoTextWrap>
                <FriendCityWrap>
                  <FriendInfoTextMinor>協作城市：</FriendInfoTextMinor>
                  <CityBannerWrap>
                    <MyCityText>{friendInfo.coopCityName}</MyCityText>
                    <MyCityNoticeWrap
                      onClick={() => {
                        if (friendInfo.coopCityId === currentCityId) {
                          return;
                        } else {
                          dispatch(
                            CITY_REDIRECTION({
                              userId,
                              cityId: friendInfo.coopCityId,
                            })
                          );
                          dispatch(
                            SWITCH_PAGE({ userId, pageActivity: 'city' })
                          );
                        }
                      }}
                    >
                      <MyCityNotice>
                        {friendInfo.coopCityId === currentCityId
                          ? '目前'
                          : '前往'}
                      </MyCityNotice>
                    </MyCityNoticeWrap>
                  </CityBannerWrap>
                </FriendCityWrap>
                <FriendCityWrap>
                  <FriendInfoTextMinor>好友城市：</FriendInfoTextMinor>
                  {friendInfo.personalCityName === '' ? (
                    <FriendCityInfoText>無個人城市</FriendCityInfoText>
                  ) : (
                    <CityBannerWrap>
                      <MyCityText>{friendInfo.personalCityName}</MyCityText>
                      <FriendsCityNoticeWrap
                        onClick={() => {
                          dispatch(
                            CITY_REDIRECTION({
                              userId,
                              cityId: friendInfo.personalCityId,
                            })
                          );
                          dispatch(
                            SWITCH_PAGE({ userId, pageActivity: 'city' })
                          );
                        }}
                      >
                        <MyCityNotice>造訪</MyCityNotice>
                      </FriendsCityNoticeWrap>
                    </CityBannerWrap>
                  )}
                </FriendCityWrap>
              </FriendInfo>
            ))}
          {friendInfoCollection.length !== 0 &&
            friendInfoCollection.map((friendInfo, index) => (
              <FriendInfo key={friendInfo.userId}>
                <FriendPorTraitWrap>
                  <FriendPorTrait src={friendInfo.userPortraitUrl} />
                </FriendPorTraitWrap>
                <FriendInfoTextWrap>
                  <FriendInfoText>{friendInfo.userNickName}</FriendInfoText>
                  <FriendInfoTextMinor>
                    {friendInfo.userEmail}
                  </FriendInfoTextMinor>
                  <FriendInfoTextMinor>{`最近活躍：${lastActiveDate(
                    friendInfo.lastActiveTime
                  )}`}</FriendInfoTextMinor>
                </FriendInfoTextWrap>
                <FriendCityWrap>
                  <FriendInfoTextMinor>協作城市：</FriendInfoTextMinor>
                  <CityBannerWrap>
                    <MyCityText>{friendInfo.coopCityName}</MyCityText>
                    <MyCityNoticeWrap
                      onClick={() => {
                        if (friendInfo.coopCityId === currentCityId) {
                          return;
                        } else {
                          dispatch(
                            CITY_REDIRECTION({
                              userId,
                              cityId: friendInfo.coopCityId,
                            })
                          );
                          dispatch(
                            SWITCH_PAGE({ userId, pageActivity: 'city' })
                          );
                        }
                      }}
                    >
                      <MyCityNotice>
                        {friendInfo.coopCityId === currentCityId
                          ? '目前'
                          : '前往'}
                      </MyCityNotice>
                    </MyCityNoticeWrap>
                  </CityBannerWrap>
                </FriendCityWrap>
                <FriendCityWrap>
                  <FriendInfoTextMinor>好友城市：</FriendInfoTextMinor>
                  {friendInfo.personalCityName === '' ? (
                    <FriendCityInfoText>無個人城市</FriendCityInfoText>
                  ) : (
                    <CityBannerWrap>
                      <MyCityText>{friendInfo.personalCityName}</MyCityText>
                      <FriendsCityNoticeWrap
                        onClick={() => {
                          dispatch(VISIT_CITY(friendInfo.coopCityId));
                          // dispatch(
                          //   CITY_REDIRECTION({
                          //     userId,
                          //     cityId: friendInfo.personalCityId,
                          //   })
                          // );
                          // dispatch(
                          //   SWITCH_PAGE({ userId, pageActivity: 'city' })
                          // );
                        }}
                      >
                        <MyCityNotice>造訪</MyCityNotice>
                      </FriendsCityNoticeWrap>
                    </CityBannerWrap>
                  )}
                </FriendCityWrap>
              </FriendInfo>
            ))}
        </FriendListWrap>
      </FriendListsWrap>

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
      {/* <p>輸入好友 gmail</p>
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
              // TODO: choose city
              const friendId = queryResult[0].userId;
              const cityId = cityList[0];
              dispatch(FRIEND_REQUEST({ friendId, cityId }));
            }}
          >
            加好友並共管城市
          </button>
          <p>{`共管城市：${cityName}`}</p>
        </>
      )} */}
    </Wrap>
  );
};

type WrapProps = {
  $isShown: boolean;
};

const Wrap = styled.div<WrapProps>`
  border: #ffffff 3px solid;
  background-color: #f2f2f2;
  border-radius: 20px 20px 0 0;
  color: #808080;

  width: 40%;
  height: 80vh;
  position: absolute;
  right: 0;
  z-index: 6;
  overflow: hidden;
  bottom: ${({ $isShown }) => ($isShown ? '0' : 'calc(-80%)')};
  transition: bottom 1s ease;
`;

const HeaderRow = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 3px solid #e6e6e6;
`;

const SocialIcon = styled(FontAwesomeIcon)`
  color: #808080;
  font-size: 24px;
`;

const HeaderText = styled.p`
  padding-left: 10px;
  line-height: 60px;
  font-size: 20px;
`;

const FriendListsWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FriendListWrap = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const FriendListTitle = styled.p`
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 20px;
  color: #dabd7a;
  background-color: #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FriendInfo = styled.div`
  display: flex;
  width: 100%;
  /* justify-content: center; */
  align-items: center;
  gap: 20px;
  position: relative;
`;

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
const FriendCityInfoText = styled(FriendInfoTextMinor)`
  line-height: 22px;
`;
const FriendCityWrap = styled(FriendInfoTextWrap)`
  width: 20%;
`;

const CityBannerWrap = styled.div`
  width: auto;
  margin-top: 3px;
  padding: 0 10px;
  height: 24px;
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
  font-size: 14px;
  color: #ae7a00;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MyCityNoticeWrap = styled.div`
  /* font-size: 18px; */
  /* line-height: 36px; */
  width: 100%;
  height: 22px;
  color: #ae7a00;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  opacity: 0;
  padding-left: 5px;
  cursor: pointer;
  transition: opacity 0.5s ease;

  &:hover {
    opacity: 1;
  }
`;

const MyCityNotice = styled.div`
  font-size: 12px;
  margin-right: 3px;
  line-height: 22px;
  border-radius: 5px;
  padding: 1px 3px;
  color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: #ae7a00;
`;

const FriendsCityNoticeWrap = styled(MyCityNoticeWrap)`
  &:hover {
    opacity: 1;
  }
`;
