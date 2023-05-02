import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  CITY_REDIRECTION,
  FRIEND_REQUEST,
  FriendStatusState,
  GET_CITY_NAME,
  QUEST_FRIEND,
  TYPING_FRIEND_EMAIL,
} from '../../redux/reducers/userInfoSlice';
import {
  GET_FRIENDS_INFO,
  AGREE_COOPERATIONS,
} from '../../redux/reducers/usersActivitySlice';
import { ClosingButton } from '../../component/ClosingButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import {
  SOCIAL_SECTION_TOGGLE,
  SWITCH_PAGE,
} from '../../redux/reducers/pageControlSlice';
import banner from '../../assets/banner.png';
//TODO:
import { VISIT_CITY } from '../../redux/reducers/cityBasicInfoSlice';
import { UserBasics } from '../../component/UserBasics';

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
  const { pageActivity, socialSectionClosed } = useAppSelector(
    (state) => state.pageControl
  );
  const currentCityId = cityList[0];

  const friendIds = friends.map((friend) => friend.userId);

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
    const findFriendCondition = (user: FriendStatusState) =>
      user.userId === friendId;
    const coopCityId = friends.find(findFriendCondition)?.coopCityId || '';
    const personalCityId =
      friendCityList.find((data) => data !== coopCityId) || '';
    return {
      ...friendInfo,
      friendStatus: friends.find(findFriendCondition)?.friendStatus || '',
      coopStatus: friends.find(findFriendCondition)?.coopStatus || '',
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
          <FriendListTitle
            onClick={() => dispatch(SOCIAL_SECTION_TOGGLE('cooperated'))}
          >
            協作好友
          </FriendListTitle>
          <FriendInfoWrap
            $isClosed={socialSectionClosed.includes('cooperated')}
          >
            {friendInfoCollection.length !== 0 &&
              friendInfoCollection.map(
                (friendInfo, index) =>
                  friendInfo.coopStatus === 'coorperated' && (
                    <FriendInfo key={friendInfo.userId}>
                      <UserBasics
                        payload={{
                          userPortraitUrl: friendInfo.userPortraitUrl,
                          userNickName: friendInfo.userNickName,
                          userEmail: friendInfo.userEmail,
                          lastActiveTime: friendInfo.lastActiveTime,
                        }}
                      />
                      <FriendCityWrap>
                        <FriendCityInfoTitle>協作城市</FriendCityInfoTitle>
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
                      {/* <FriendCityWrap>
                        <FriendCityInfoTitle>好友城市</FriendCityInfoTitle>
                        {friendInfo.personalCityName === '' ? (
                          <FriendCityInfoText>無個人城市</FriendCityInfoText>
                        ) : (
                          <CityBannerWrap>
                            <MyCityText>
                              {friendInfo.personalCityName}
                            </MyCityText>
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
                      </FriendCityWrap> */}
                    </FriendInfo>
                  )
              )}
          </FriendInfoWrap>
        </FriendListWrap>
        {/* <FriendListWrap>
          <FriendListTitle
            onClick={() => dispatch(SOCIAL_SECTION_TOGGLE('friend'))}
          >
            一般好友
          </FriendListTitle>
          <FriendInfoWrap $isClosed={socialSectionClosed.includes('friend')}>
            {friendInfoCollection.length !== 0 &&
              friendInfoCollection.map(
                (friendInfo, index) =>
                  // TODO 改成 是好友，但不是協作好友
                  // friendInfo.friendStatus === 'friend' &&
                  friendInfo.coopStatus === 'coorperated' && (
                    <FriendInfo key={friendInfo.userId}>
                      <UserBasics
                        payload={{
                          userPortraitUrl: friendInfo.userPortraitUrl,
                          userNickName: friendInfo.userNickName,
                          userEmail: friendInfo.userEmail,
                          lastActiveTime: friendInfo.lastActiveTime,
                        }}
                      />
                      <FriendCityWrap>
                        <InvitationButton>邀請協作</InvitationButton>
                        <InviteCityBannerWrap>
                          <InviteCityText>
                            {friendInfo.coopCityName}
                          </InviteCityText>
                          <FriendsCityNoticeWrap onClick={() => {}}>
                            <MyCityNotice>切換</MyCityNotice>
                          </FriendsCityNoticeWrap>
                        </InviteCityBannerWrap>
                      </FriendCityWrap>
                      <FriendCityWrap>
                        <FriendCityInfoTitle>好友城市</FriendCityInfoTitle>
                        {friendInfo.personalCityName === '' ? (
                          <FriendCityInfoText>無個人城市</FriendCityInfoText>
                        ) : (
                          <CityBannerWrap>
                            <MyCityText>
                              {friendInfo.personalCityName}
                            </MyCityText>
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
                  )
              )}
          </FriendInfoWrap>
        </FriendListWrap> */}
        <FriendListWrap>
          <FriendListTitle
            onClick={() => dispatch(SOCIAL_SECTION_TOGGLE('inviting'))}
          >
            尚待確認
          </FriendListTitle>
          <FriendInfoWrap $isClosed={socialSectionClosed.includes('inviting')}>
            {friendInfoCollection.length !== 0 &&
              friendInfoCollection.map(
                (friendInfo, index) =>
                  // TODO 改成 還在確認友情關係
                  // friendInfo.friendStatus === 'friend' &&
                  (friendInfo.coopStatus === 'inviting' ||
                    friendInfo.coopStatus === 'invited') && (
                    <FriendInfo key={friendInfo.userId}>
                      <UserBasics
                        payload={{
                          userPortraitUrl: friendInfo.userPortraitUrl,
                          userNickName: friendInfo.userNickName,
                          userEmail: friendInfo.userEmail,
                          lastActiveTime: friendInfo.lastActiveTime,
                        }}
                      />
                      <FriendCityWrap>
                        <FriendCityInfoTitle>好友邀請</FriendCityInfoTitle>
                        <ButtonWrap>
                          <AgreeButton>同意</AgreeButton>
                          <DisAgreeButton>不同意</DisAgreeButton>
                        </ButtonWrap>
                      </FriendCityWrap>
                      <FriendCityWrap>
                        <WaitingButton>好友邀請中</WaitingButton>
                      </FriendCityWrap>
                    </FriendInfo>
                  )
              )}
          </FriendInfoWrap>
        </FriendListWrap>

        {/* {
          <button
            onClick={() => {
              const friendId = '';
              const cityId = '';
              if (cityId) {
                dispatch(AGREE_COOPERATIONS({ userId, friendId, cityId }));
              }
            }}
          >
            同意邀請funciton
          </button>
        } */}

        <p>下面的css 還沒刻...</p>
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
        )}
      </FriendListsWrap>
    </Wrap>
  );
};

type WrapProps = {
  $isShown: boolean;
};

type FriendInfoWrapProps = {
  $isClosed: boolean;
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
  width: 100%;
  height: calc(80vh - 60px);
  overflow: scroll;
`;

const FriendListWrap = styled.div`
  width: 100%;
  padding: 0 10px;
  /* padding-bottom: 30px; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const FriendListTitle = styled.p`
  margin-top: 30px;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 20px;
  color: #dabd7a;
  background-color: #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const FriendInfoWrap = styled.div<FriendInfoWrapProps>`
  width: 100%;
  transform: ${({ $isClosed }) => ($isClosed ? 'rotateX(90deg)' : '')};
  /* TODO: normal height */
  height: ${({ $isClosed }) => ($isClosed ? '0' : '100px')};
  overflow: ${({ $isClosed }) => ($isClosed ? 'overflow' : 'scroll')};
  transition: height 1s ease, transform 0.7s ease;
`;

const FriendInfo = styled.div`
  display: flex;
  width: 100%;
  /* justify-content: center; */
  align-items: center;
  gap: 10px;
  position: relative;
`;

const FriendInfoTextWrap = styled.div`
  width: 35%;
  height: 100%;
  padding-top: 5px;
  display: flex;
  flex-direction: column;
`;
const FriendCityInfoTitle = styled.p`
  font-size: 16px;
  padding-top: 3px;
  text-align: center;
  line-height: 22px;
  color: #808080;
`;
const FriendCityInfoText = styled(FriendCityInfoTitle)`
  opacity: 0.6;
  line-height: 22px;
  font-size: 12px;
`;
const FriendCityWrap = styled(FriendInfoTextWrap)`
  width: 20%;
`;

const CityBannerWrap = styled.div`
  width: auto;
  margin-top: 3px;
  padding: 0 10px;
  height: 24px;
  display: flex;
  justify-content: center;
  background-image: url(${banner});
  background-size: 100% 100%;
  border-radius: 5px;
  position: relative;
  cursor: pointer;
`;

const InviteCityBannerWrap = styled(CityBannerWrap)`
  /* height: 18px; */
  /* width: 70%; */
  /* margin: auto; */
  opacity: 0.7;
`;

const MyCityText = styled.div`
  font-size: 14px;
  color: #ae7a00;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InviteCityText = styled(MyCityText)`
  font-size: 12px;
`;

const MyCityNoticeWrap = styled.div`
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

const ButtonTemplate = styled.button`
  margin: auto;
  padding: 1px 0;
  font-size: 14px;
  width: 80px;
  border: #f2f2f2 2px solid;
  border-radius: 16px;
  cursor: pointer;
  transition: filter 0.5s ease;
  &:hover {
    filter: brightness(1.1);
  }
`;

const InvitationButton = styled(ButtonTemplate)`
  background-color: #f0d2aa;
  color: #ae7a00;
`;

const AgreeButton = styled(ButtonTemplate)`
  background-color: #ccf0aa;
  color: #7dae00;
  font-size: 12px;
`;

const ButtonWrap = styled.div`
  display: flex;
`;

const DisAgreeButton = styled(ButtonTemplate)`
  background-color: #f0acaa;
  color: #ae2600;
  font-size: 12px;
`;
const WaitingButton = styled(ButtonTemplate)`
  background-color: #e6e6e6;
  color: #808080;
  font-size: 12px;
  cursor: default;
  &:hover {
    filter: brightness(1);
  }
`;
