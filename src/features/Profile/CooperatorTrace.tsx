import {
  faBed,
  faChartPie,
  faFilePen,
  faPersonRunning,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import cityIcon from '../../assets/cityIcon.png';
import mapPin from '../../assets/mapPin.png';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { SWITCH_SECTION_FOCUSED } from '../../redux/reducers/pageControlSlice';
import {
  CurrentActionState,
  GET_COOP_FRIEND_ACTIVITY,
  GET_FRIENDS_INFO,
} from '../../redux/reducers/userInfoSlice';
import { db } from '../../utils/firebase';

export const CooperatorTrace: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { accessUsers } = useAppSelector((state) => state.city.basicInfo);
  const { coopInfo, friendsInfo, friends } = useAppSelector(
    (state) => state.userInfo
  );
  const { isTouring } = useAppSelector((state) => state.city);
  const friendIds = friends.map((friend) => friend.userId);

  const coopFriends = accessUsers.filter((id) => id !== userId);
  const cooperators = Object.keys(coopInfo);
  const cooperatorsPortrait = cooperators.map(
    (cooperator) => friendsInfo[cooperator]?.userPortraitUrl
  );
  const cooperatorsAction = cooperators.map(
    (cooperator) => coopInfo[cooperator].currentActivity
  );

  const dispatch = useAppDispatch();

  const getPinLocation = (action: string) => {
    let endPoint: string = '';
    switch (action) {
      case 'ledger':
        endPoint = 'translateY(50%) translateX(100%)';
        break;
      case 'statistics':
        endPoint = 'translateY(50%) translateX(0%)';
        break;
      case 'profile':
        endPoint = 'translateY(50%) translateX(200%)';
        break;
      case 'leave':
        endPoint = 'translateY(-50%) translateX(300%)';
        break;
      default:
        endPoint = 'translateY(-50%) translateX(100%)';
        break;
    }
    return endPoint;
  };

  useEffect(() => {
    if (friends.length !== 0) {
      friendIds.forEach((friendId) => {
        dispatch(GET_FRIENDS_INFO(friendId));
      });
    }
  }, [friends]);

  useEffect(() => {
    if (accessUsers.length !== 0 && accessUsers.includes(userId) === false) {
    } else if (accessUsers.length !== 0 && coopFriends.length !== 0) {
      coopFriends.forEach((friendId) => {
        const unsubscribe = onSnapshot(
          doc(db, 'allUserStatus', friendId),
          (doc) => {
            const data = doc?.data();
            if (data) {
              const { fadeOutTime, latestActiveTime } = data;
              const fadeOutTimeSecond = fadeOutTime?.seconds;
              const latestActiveTimeSecond = latestActiveTime?.seconds;
              const currentActivity =
                data?.currentActivity as CurrentActionState;
              dispatch(
                GET_COOP_FRIEND_ACTIVITY({
                  friendId,
                  data: {
                    currentActivity,
                    fadeOutTimeSecond,
                    latestActiveTimeSecond,
                  },
                })
              );
            }
          }
        );
        return () => unsubscribe();
      });
    }
  }, [accessUsers]);

  return (
    <Wrap $isFolded={isTouring}>
      <Title>協作市長動態</Title>
      <Background $hasCoopFriend={coopFriends.length > 0}>
        {coopFriends.length === 0 && (
          <Suggestion
            onClick={() =>
              dispatch(
                SWITCH_SECTION_FOCUSED({ userId, pageActivity: 'profile' })
              )
            }
          >
            <SuggestionText>本座城市還沒有協作市長</SuggestionText>
            <SuggestionText>點此前往邀請！</SuggestionText>
            <ActionIcon icon={faPersonRunning} />
          </Suggestion>
        )}
      </Background>
      {coopFriends.length > 0 && (
        <IconBlocks>
          <IconBlock>
            <MapPathUpLeft />
          </IconBlock>
          <IconBlock>
            <MapPathUpMiddle />
            <CityIcon src={cityIcon} />
          </IconBlock>
          <IconBlock>
            <MapPathUpRight />
          </IconBlock>
          <IconBlock>
            <OffLineIconBack>
              <OffLineIcon icon={faBed} />
            </OffLineIconBack>
          </IconBlock>
          <IconBlock>
            <PagesIconBack>
              <Icon icon={faChartPie} />
            </PagesIconBack>
          </IconBlock>
          <IconBlock>
            <MapPath />
            <PagesIconBack>
              <Icon icon={faFilePen} />
            </PagesIconBack>
          </IconBlock>
          <IconBlock>
            <MapPath />
            <PagesIconBack>
              <Icon icon={faUsers} />
            </PagesIconBack>
          </IconBlock>
          <IconBlock></IconBlock>
          {coopFriends.map((coopFriend, index) => (
            <UserPinWrap
              key={index}
              endPoint={`${getPinLocation(cooperatorsAction[index])}`}
            >
              <UserPortraitWrap>
                {cooperatorsAction[index] && (
                  <UserPortrait
                    src={cooperatorsPortrait[index] as string}
                    alt={`portrait of ${coopFriend}`}
                  />
                )}
              </UserPortraitWrap>
              <UserPin src={mapPin} />
            </UserPinWrap>
          ))}
        </IconBlocks>
      )}
    </Wrap>
  );
};

type BackgroundProps = {
  $hasCoopFriend: boolean;
};

type WrapProps = {
  $isFolded: boolean;
};

const Wrap = styled.div<WrapProps>`
  position: fixed;
  z-index: 3;
  right: 50px;
  top: 180px;
  display: flex;
  flex-direction: column;
  gap: 17px;
  transition: transform 1s ease;
  transform: ${({ $isFolded }) => ($isFolded ? 'translateX(120%)' : '')};
`;

const Title = styled.div`
  font-size: 20px;
  letter-spacing: 16%;
  color: #ae7a00;
  font-weight: bold;
  text-align: end;
`;

const Background = styled.div<BackgroundProps>`
  width: 18.5vw;
  height: ${({ $hasCoopFriend }) => ($hasCoopFriend ? '25.5vh' : '96px')};
  background-color: black;
  opacity: 0.5;
  border-radius: 20px;
`;

const CityIcon = styled.img`
  height: 100%;
  width: 100%;
  z-index: 1;
  object-fit: contain;
`;

const IconBlocks = styled.div`
  position: absolute;
  height: 70%;
  width: 100%;
  bottom: 0%;
  display: flex;
  flex-wrap: wrap;
`;

const IconBlock = styled.div`
  height: 50%;
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PagesIconBack = styled.div`
  width: 50px;
  height: 50px;
  z-index: 1;

  border-radius: 25px;
  background-color: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  color: #808080;
  height: 30px;
`;

const OffLineIconBack = styled(PagesIconBack)`
  background-color: #808080;
`;

const OffLineIcon = styled(Icon)`
  color: #f2f2f2;
`;

type UserPinWrapProps = {
  endPoint: string;
};

const UserPinWrap = styled.div<UserPinWrapProps>`
  position: absolute;
  z-index: 2;
  width: 25%;
  height: 50%;
  transform: ${({ endPoint }) => endPoint};
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 1s ease;
`;

const UserPortraitWrap = styled.div`
  position: absolute;
  z-index: 1;
  top: 6px;
  max-width: 80%;
  height: 60%;
  border-radius: 50%;
  border: 2px rgba(255, 255, 255, 0.6) solid;
  display: flex;
  justify-content: center;
  overflow: hidden;
`;

const UserPortrait = styled.img`
  height: 100%;
  object-fit: contain;
`;

const UserPin = styled.img`
  position: absolute;
  max-width: 100%;
  height: 100%;
  object-fit: scale-down;
`;

const MapPath = styled.div`
  height: 8%;
  position: absolute;
  width: 25%;
  z-index: 0;
  background-color: #f2f2f2;
  transform: translateX(-50%);
`;

const MapPathUp = styled.div`
  height: 70%;
  position: absolute;
  width: 6%;
  z-index: 0;
  background-color: #f2f2f2;
`;

const MapPathUpLeft = styled(MapPathUp)`
  transform: translateY(33%) translateX(200%) rotate(36deg);
`;
const MapPathUpRight = styled(MapPathUp)`
  transform: translateY(33%) translateX(-200%) rotate(-36deg);
`;
const MapPathUpMiddle = styled(MapPathUp)`
  transform: translateY(50%);
  height: 50%;
`;

const Suggestion = styled.div``;

const SuggestionText = styled.p`
  width: 100%;
  text-align: center;
  padding-top: 20px;
  color: #dabd7a;
  cursor: pointer;
`;

const Running = keyframes`
  0%{
    transform: translateX(0);
  }
  66%{
    transform: translateX(120%);
  }
  100%{
    transform: translateX(120%);
  }
`;

const ActionIcon = styled(FontAwesomeIcon)`
  position: absolute;
  bottom: 19px;
  right: 15%;
  padding-top: 10px;
  text-align: end;
  color: #dabd7a;
  font-size: 28px;
  animation: ${Running} 2s infinite ease-in;
`;
