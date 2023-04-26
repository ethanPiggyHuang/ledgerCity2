import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import {
  GET_COOP_FRIEND_ACTIVITY,
  CurrentActionState,
  GET_FRIENDS_INFO,
} from '../../redux/reducers/usersActivitySlice';
import cityIcon from '../../assets/cityIcon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faUsers,
  faFilePen,
  faBed,
} from '@fortawesome/free-solid-svg-icons';
import mapPin from '../../assets/mapPin.png';

export const CooperatorTrace: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { accessUsers } = useAppSelector((state) => state.cityBasicInfo);
  const { coopInfo, friendsInfo } = useAppSelector(
    (state) => state.userActivity
  );
  const { friends } = useAppSelector((state) => state.userInfo);
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
    if (coopFriends.length !== 0) {
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
    <Wrap>
      <Title>協作市長動態</Title>
      <Background />
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
    </Wrap>
  );
};

const Wrap = styled.div`
  position: fixed;
  z-index: 4;
  right: 50px;
  top: 180px;
  display: flex;
  flex-direction: column;
  gap: 17px;
`;

const Title = styled.div`
  font-size: 20px;
  letter-spacing: 16%;
  color: #ae7a00;
  font-weight: bold;
`;

const Background = styled.div`
  width: 18.5vw;
  height: 25.5vh;
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

const move = keyframes`
  from {
    transform: translateY(-50%) translateX(300%);
  }
  to{
    transform: translateY(-50%) translateX(100%);
  }
`;

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
  /* animation: ${move} 1.5s ease-in-out forwards; */
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
