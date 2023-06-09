import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import banner from '../../assets/banner.png';
import { ClosingButton } from '../../component/ClosingButton';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  SWITCH_SECTION_FOCUSED,
  TOGGLE_SOCIAL_SECTION,
} from '../../redux/reducers/pageControlSlice';
import {
  AGREE_COOPERATION,
  DISAGREE_COOPERATION,
  FriendStatusState,
  GET_FRIENDS_INFO,
  GET_OTHER_CITY_NAME,
  REDIRECT_CITY,
  SEARCH_FRIEND,
  SEND_COOPERATION_REQUEST,
  SWITCH_COOP_CITY_OPTION,
  TYPE_FRIEND_EMAIL,
} from '../../redux/reducers/userInfoSlice';
import { UserBasics } from '../Profile/UserBasics';

export const Social: React.FC = () => {
  const { userId, cityList } = useAppSelector((state) => state.userInfo.data);
  const { friends, friendsInfo, coopInfo } = useAppSelector(
    (state) => state.userInfo
  );
  const { cityNames, cityAccessUsers, chosenCoopCityIndex } = useAppSelector(
    (state) => state.userInfo.additionalData
  );
  const { pageActivity, socialSectionClosed } = useAppSelector(
    (state) => state.pageControl
  );
  const dispatch = useAppDispatch();

  const currentCityId = cityList[0];
  const friendIds = friends.map((friend) => friend.userId);

  useEffect(() => {
    if (friends.length !== 0) {
      friendIds.forEach((friendId) => {
        dispatch(GET_FRIENDS_INFO(friendId));
      });
    }
  }, [friends]);

  useEffect(() => {
    if (cityList.length !== 0) {
      cityList.forEach((cityId) => dispatch(GET_OTHER_CITY_NAME(cityId)));
    }
  }, [cityList]);

  const { emailInput, queryResult } = useAppSelector(
    (state) => state.userInfo.editStatus
  );

  const friendsArray = Object.values(friendsInfo);

  const friendInfoCollection = friendsArray.map((friendInfo) => {
    const friendId = friendInfo.userId;
    const findFriendCondition = (user: FriendStatusState) =>
      user.userId === friendId;
    const coopCityId = friends.find(findFriendCondition)?.coopCityId || '';
    return {
      ...friendInfo,
      coopStatus: friends.find(findFriendCondition)?.coopStatus || '',
      lastActiveTime:
        coopInfo[friendId]?.fadeOutTimeSecond ||
        coopInfo[friendId]?.latestActiveTimeSecond ||
        0,
      coopCityId,
      coopCityName: cityNames[coopCityId] || '',
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
            onClick={() => dispatch(TOGGLE_SOCIAL_SECTION('cooperated'))}
          >
            協作好友
          </FriendListTitle>
          <FriendInfoWrap
            $isClosed={socialSectionClosed.includes('cooperated')}
          >
            {friendInfoCollection.length !== 0 &&
              friendInfoCollection.map(
                (friendInfo) =>
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
                                  REDIRECT_CITY({
                                    userId,
                                    cityId: friendInfo.coopCityId,
                                  })
                                );
                                dispatch(
                                  SWITCH_SECTION_FOCUSED({
                                    userId,
                                    pageActivity: 'city',
                                  })
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
                    </FriendInfo>
                  )
              )}
          </FriendInfoWrap>
        </FriendListWrap>
        <FriendListWrap>
          <FriendListTitle
            onClick={() => dispatch(TOGGLE_SOCIAL_SECTION('inviting'))}
          >
            邀請中
          </FriendListTitle>
          <FriendInfoWrap $isClosed={socialSectionClosed.includes('inviting')}>
            {friendInfoCollection.length !== 0 &&
              friendInfoCollection.map(
                (friendInfo) =>
                  friendInfo.coopStatus === 'inviting' && (
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
                        <WaitingButton>協作邀請中</WaitingButton>
                        <CoopCityText>邀請城市：</CoopCityText>
                        <CoopCityText>
                          {cityNames[friendInfo.coopCityId]}
                        </CoopCityText>
                      </FriendCityWrap>
                    </FriendInfo>
                  )
              )}
          </FriendInfoWrap>
        </FriendListWrap>
        <FriendListWrap>
          <FriendListTitle
            onClick={() => dispatch(TOGGLE_SOCIAL_SECTION('inviting'))}
          >
            受邀請
          </FriendListTitle>
          <FriendInfoWrap $isClosed={socialSectionClosed.includes('inviting')}>
            {friendInfoCollection.length !== 0 &&
              friendInfoCollection.map(
                (friendInfo) =>
                  friendInfo.coopStatus === 'beenInvited' && (
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
                        <FriendCityInfoTitle>協作邀請</FriendCityInfoTitle>
                        <CoopCityText>受邀城市：</CoopCityText>
                        <CoopCityText>
                          記帳小城
                          {cityNames[friendInfo.coopCityId]}
                        </CoopCityText>
                        <ButtonWrap>
                          <AgreeButton
                            onClick={() => {
                              const friendId = friendInfo.userId;
                              const cityId = friendInfo.coopCityId;
                              dispatch(
                                AGREE_COOPERATION({ userId, friendId, cityId })
                              );
                            }}
                          >
                            同意
                          </AgreeButton>
                          <DisAgreeButton
                            onClick={() => {
                              const friendId = friendInfo.userId;
                              dispatch(
                                DISAGREE_COOPERATION({ userId, friendId })
                              );
                            }}
                          >
                            不同意
                          </DisAgreeButton>
                        </ButtonWrap>
                      </FriendCityWrap>
                    </FriendInfo>
                  )
              )}
          </FriendInfoWrap>
        </FriendListWrap>

        <FriendListWrap>
          <FriendListTitle
            onClick={() => dispatch(TOGGLE_SOCIAL_SECTION('search'))}
          >
            查詢好友
          </FriendListTitle>
          <FriendInfoWrap $isClosed={socialSectionClosed.includes('search')}>
            <FriendSearchTitle>輸入好友 gmail</FriendSearchTitle>
            <FriendSearchInput
              type="text"
              value={emailInput}
              onChange={(event) => {
                dispatch(TYPE_FRIEND_EMAIL(event.target.value));
              }}
            />
            <FriendSearchInputPrefix>@gmail.com</FriendSearchInputPrefix>

            <FriendSearchButton
              onClick={() => {
                dispatch(SEARCH_FRIEND(emailInput));
              }}
            >
              查詢
            </FriendSearchButton>
            {queryResult.length !== 0 && queryResult[0].userId === userId && (
              <FriendSearchText>這是你自己的帳號喔</FriendSearchText>
            )}
            {queryResult.length !== 0 && queryResult[0].userId !== userId && (
              <>
                <FriendSearchText>{`名字：${queryResult[0].userName}`}</FriendSearchText>
                <FriendSearchText>{`暱稱：${
                  queryResult[0]?.userNickName || queryResult[0].userName
                }`}</FriendSearchText>
                {queryResult[0]?.userPortraitUrl && (
                  <img
                    src={queryResult[0].userPortraitUrl}
                    alt={`portait of ${queryResult[0].userName}`}
                  />
                )}
                <FriendSearchBlank />
                <FriendSearchText>{`要與他共同管理城市嗎？`}</FriendSearchText>
                <FriendSearchText>{`預計共同管理城市：`}</FriendSearchText>
                <FriendSearchCityOption
                  onClick={() => dispatch(SWITCH_COOP_CITY_OPTION())}
                >{`${
                  cityNames[cityList[chosenCoopCityIndex]]
                }`}</FriendSearchCityOption>
                <FriendSearchNotice>{`目前協作人數：${
                  cityAccessUsers[cityList[chosenCoopCityIndex]].length
                }人`}</FriendSearchNotice>
                {cityAccessUsers[cityList[chosenCoopCityIndex]].length === 2 ? (
                  <FriendSearchWarn>協作人數已達上限</FriendSearchWarn>
                ) : (
                  ''
                )}
                <FriendSearchSubmit
                  onClick={() => {
                    const cityId = cityList[chosenCoopCityIndex];
                    if (cityAccessUsers[cityId].length > 1) {
                      alert(
                        `每座城市最多兩人共同協作，${cityNames[cityId]}協作人數已達上限，請選擇其他城市。`
                      );
                    } else {
                      const friendId = queryResult[0].userId;
                      dispatch(SEND_COOPERATION_REQUEST({ friendId, cityId }));
                    }
                  }}
                >
                  成為協作好友，共同管理城市
                </FriendSearchSubmit>
              </>
            )}
          </FriendInfoWrap>
        </FriendListWrap>
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const FriendListTitle = styled.p`
  margin-top: 10px;
  padding: 5px 20px;
  border-radius: 20px;
  font-size: 20px;
  color: #dabd7a;
  background-color: #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    filter: brightness(0.95);
  }
`;

const FriendInfoWrap = styled.div<FriendInfoWrapProps>`
  width: 100%;
  transform: ${({ $isClosed }) => ($isClosed ? 'rotateX(90deg)' : '')};
  height: ${({ $isClosed }) => ($isClosed ? '0' : '100px')};
  overflow: ${({ $isClosed }) => ($isClosed ? 'overflow' : 'scroll')};
  transition: height 1s ease, transform 0.7s ease;
`;

const FriendInfo = styled.div`
  display: flex;
  width: 100%;
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

const MyCityText = styled.div`
  font-size: 14px;
  color: #ae7a00;
  display: flex;
  align-items: center;
  justify-content: center;
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

const CoopCityText = styled.p`
  font-size: 12px;
`;

const FriendSearchTitle = styled.p``;

const FriendSearchInput = styled.input``;

const FriendSearchInputPrefix = styled.span``;

const FriendSearchButton = styled.button``;

const FriendSearchText = styled.p``;

const FriendSearchCityOption = styled.p`
  padding: 5px 10px;
  color: #aa9d7a;
  border: 1px brown solid;
  width: 200px;
  cursor: pointer;
`;

const FriendSearchBlank = styled.br``;

const FriendSearchNotice = styled.p`
  font-size: 12px;
`;

const FriendSearchWarn = styled.p`
  font-size: 12px;
  color: darkred;
`;

const FriendSearchSubmit = styled.button``;
