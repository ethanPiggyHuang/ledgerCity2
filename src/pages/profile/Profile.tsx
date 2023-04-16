import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { getAuth, signOut } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { updateLocation } from '../../redux/api/userAPI';
import { NavBar } from '../gameMap/NavBar';

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

  return (
    <Wrap>
      <p>{`userId: ${userId}`}</p>
      <p>{`locatiton: ${cooperatorLocation}`}</p>
      <p>{`isEditingCity: ${isEditingCity}`}</p>
      <p>{`fadeOutTime: ${fadeOutTime ? new Date(fadeOutTime * 1000) : ''}`}</p>
      <p>{`latestActiveTime: ${
        latestActiveTime ? new Date(latestActiveTime * 1000) : ''
      }`}</p>
      <NavBar />
      <button onClick={() => signOut(auth)}>Sign out</button>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 20px;
  position: relative;
  display: flex;
  gap: 20px;
`;
