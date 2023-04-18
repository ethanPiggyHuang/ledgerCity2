import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { GET_COOP_FRIEND_ACTIVITY } from '../../redux/reducers/usersActivitySlice';

export const Setting: React.FC = () => {
  const { userId, friends } = useAppSelector((state) => state.userInfo.data);
  const friendIds = friends.map((friend) => friend.userId);

  const dispatch = useAppDispatch();

  return (
    <Wrap>
      {/* {friends.map((friend) => (
        <>
          <img src={friend.portraitUrl} alt={`protrait of ${friend.name}`} />
          <p>{`name: ${friend.name}`}</p>
          <p>{`email: ${friend.email}`}</p>
          <p>{`isFriend: ${friend.friendStatus}`}</p>
          <p>{`isCoop: ${friend.coopStatus}`}</p>
          <p>{`coopCity:${friend.coopCityId}`}</p>
          <br />
        </>
      ))} */}
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 20px;
  position: relative;
  // display: flex;
  gap: 20px;
`;
