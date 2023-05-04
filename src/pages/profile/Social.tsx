import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  CITY_REDIRECTION,
  FRIEND_REQUEST,
  FriendStatusState,
  GET_CITY_NAME,
  QUEST_FRIEND,
  SWITCH_COOP_CITY_OPTION,
  TYPING_FRIEND_EMAIL,
  AGREE_COOPERATION,
  DISAGREE_COOPERATION,
} from '../../redux/reducers/userInfoSlice';
import { GET_FRIENDS_INFO } from '../../redux/reducers/usersActivitySlice';
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
  const { cityNames, cityAccessUsers, chosenCoopCityIndex } = useAppSelector(
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

  // useEffect(() => {
  //   const friendIds = Object.keys(friendsInfo);
  //   if (friendIds.length !== 0) {
  //     const allFriendsCityId = friendIds
  //       .map((friendId) => friendsInfo[friendId].cityList)
  //       .flat();
  //     allFriendsCityId.forEach((cityId) => dispatch(GET_CITY_NAME(cityId)));
  //   }
  // }, [friendsInfo]);

  useEffect(() => {
    if (cityList.length !== 0) {
      cityList.forEach((cityId) => dispatch(GET_CITY_NAME(cityId)));
    }
  }, [cityList]);

  const dispatch = useAppDispatch();

  const { emailInput, queryResult } = useAppSelector(
    (state) => state.userInfo.editStatus
  );

  // useEffect(() => {if(queryResult.length!==0){
  //   SET_COOP_CITY(cityList[0])
  // }}, []);

  const friendsArray = Object.values(friendsInfo);

  const friendInfoCollection = friendsArray.map((friendInfo) => {
    const friendId = friendInfo.userId;
    // const friendCityList = friendInfo.cityList;
    const findFriendCondition = (user: FriendStatusState) =>
      user.userId === friendId;
    const coopCityId = friends.find(findFriendCondition)?.coopCityId || '';
    // const personalCityId =
    //   friendCityList.find((data) => data !== coopCityId) || '';
    return {
      ...friendInfo,
      // friendStatus: friends.find(findFriendCondition)?.friendStatus || '',
      coopStatus: friends.find(findFriendCondition)?.coopStatus || '',
      lastActiveTime: coopInfo[friendId]?.latestActiveTimeSecond || 0,
      coopCityId,
      coopCityName: cityNames[coopCityId] || '',
      // personalCityId,
      // personalCityName: cityNames[personalCityId] || '',
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
                    </FriendInfo>
                  )
              )}
          </FriendInfoWrap>
        </FriendListWrap>
        <FriendListWrap>
          <FriendListTitle
            onClick={() => dispatch(SOCIAL_SECTION_TOGGLE('inviting'))}
          >
            邀請中
          </FriendListTitle>
          <FriendInfoWrap $isClosed={socialSectionClosed.includes('inviting')}>
            {friendInfoCollection.length !== 0 &&
              friendInfoCollection.map(
                (friendInfo, index) =>
                  // TODO 改成 還在確認友情關係
                  // friendInfo.friendStatus === 'friend' &&
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
                        <p style={{ fontSize: '12px' }}>邀請城市：</p>
                        <p style={{ fontSize: '12px' }}>
                          {cityNames[friendInfo.coopCityId]}
                        </p>
                      </FriendCityWrap>
                    </FriendInfo>
                  )
              )}
          </FriendInfoWrap>
        </FriendListWrap>
        <FriendListWrap>
          <FriendListTitle
            onClick={() => dispatch(SOCIAL_SECTION_TOGGLE('inviting'))}
          >
            受邀請
          </FriendListTitle>
          <FriendInfoWrap $isClosed={socialSectionClosed.includes('inviting')}>
            {friendInfoCollection.length !== 0 &&
              friendInfoCollection.map(
                (friendInfo, index) =>
                  // TODO 改成 還在確認友情關係
                  // friendInfo.friendStatus === 'friend' &&
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
                        <p style={{ fontSize: '12px' }}>受邀城市：</p>
                        <p style={{ fontSize: '12px' }}>
                          {cityNames[friendInfo.coopCityId]}
                        </p>
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

        <p>下面的css 還沒刻...但是功能OK</p>
        <p>輸入好友 gmail</p>
        <input
          type="text"
          value={emailInput}
          onChange={(event) => {
            dispatch(TYPING_FRIEND_EMAIL(event.target.value));
          }}
        />
        <span>@gmail.com</span>

        <button
          onClick={() => {
            dispatch(QUEST_FRIEND(emailInput));
          }}
        >
          查詢
        </button>
        {queryResult.length !== 0 && queryResult[0].userId === userId && (
          <p>這是你自己的帳號喔</p>
        )}
        {queryResult.length !== 0 && queryResult[0].userId !== userId && (
          <>
            <p>{`名字：${queryResult[0].userName}`}</p>
            <p>{`暱稱：${
              queryResult[0]?.userNickName || queryResult[0].userName
            }`}</p>
            {queryResult[0]?.userPortraitUrl && (
              <img
                src={queryResult[0].userPortraitUrl}
                alt={`portait of ${queryResult[0].userName}`}
              />
            )}
            <br />
            <p>{`要與他共同管理城市嗎？`}</p>
            <p>{`預計共同管理城市：`}</p>
            <p
              onClick={() => dispatch(SWITCH_COOP_CITY_OPTION())}
              style={{
                cursor: 'pointer',
                padding: '5px 10px',
                color: '#aa9d7a',
                border: '1px brown solid',
                width: '200px',
              }}
            >{`${cityNames[cityList[chosenCoopCityIndex]]}`}</p>
            <p
              style={{
                fontSize: '12px',
              }}
            >{`目前協作人數：${
              cityAccessUsers[cityList[chosenCoopCityIndex]].length
            }人`}</p>
            {cityAccessUsers[cityList[chosenCoopCityIndex]].length === 2 ? (
              <p
                style={{
                  fontSize: '12px',
                  color: 'darkred',
                }}
              >
                協作人數已達上限
              </p>
            ) : (
              ''
            )}
            <button
              onClick={() => {
                const cityId = cityList[chosenCoopCityIndex];
                if (cityAccessUsers[cityId].length > 1) {
                  alert(
                    `每座城市最多兩人共同協作，${cityNames[cityId]}協作人數已達上限，請選擇其他城市。`
                  );
                } else {
                  const friendId = queryResult[0].userId;
                  dispatch(FRIEND_REQUEST({ friendId, cityId }));
                }
              }}
            >
              成為協作好友，共同管理城市
            </button>
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
