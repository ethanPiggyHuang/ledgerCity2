import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { getAuth, signOut } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { updateLocation } from '../../redux/api/userAPI';
import { NavBar } from '../gameMap/NavBar';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { GET_COOP_FRIEND_ACTIVITY } from '../../redux/reducers/usersActivitySlice';

export const Profile: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data.user);
  const constId = 'myCPVIkcOYalDVvdj9hngfml3yq2'; //TODO: 要改成可變動的
  const cooperatorLocation = useAppSelector(
    (state) => state.userActivity.data[constId]?.currentPage
  );
  const { isEditingCity, fadeOutTime, latestActiveTime } = useAppSelector(
    (state) => state.userActivity.data[constId]
  );
  const dispatch = useAppDispatch();
  const auth = getAuth();

  // 監聽使用者進入頁面 -> 送到 db
  useEffect(() => {
    if (userId) {
      updateLocation(userId, 'profile');
    }
  }, [userId]);

  // 監聽好友動態（一人）
  useEffect(() => {
    if (userId) {
      const unsubscribe = onSnapshot(
        doc(db, 'allUserStatus', userId),
        (doc) => {
          if (doc) {
            const data = doc.data();
            if (data) {
              const { fadeOutTime, isEditingCity, latestActiveTime } = data;
              const fadeOutTimeSecond = fadeOutTime?.seconds;
              const latestActiveTimeSecond = latestActiveTime?.seconds;
              const currentPage = data?.currentPage as
                | 'city'
                | 'ledger'
                | 'statistics'
                | 'profile'
                | 'leave';
              dispatch(
                GET_COOP_FRIEND_ACTIVITY({
                  userId,
                  currentPage,
                  isEditingCity,
                  fadeOutTimeSecond,
                  latestActiveTimeSecond,
                })
              );
            }
          }
        }
      );

      // Stop listening to changes
      return () => unsubscribe();
    }
  }, [userId]);

  return (
    <Wrap>
      <p>{`userId: ${userId}`}</p>
      <p>{`locatiton: ${cooperatorLocation}`}</p>
      <p>{`isEditingCity: ${isEditingCity}`}</p>
      <p>{`fadeOutTime: ${fadeOutTime ? new Date(fadeOutTime * 1000) : ''}`}</p>
      <p>{`latestActiveTime: ${
        latestActiveTime ? new Date(latestActiveTime * 1000) : ''
      }`}</p>
      <br />
      <br />
      <button onClick={() => signOut(auth)}>Sign out</button>
      <NavBar />
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
