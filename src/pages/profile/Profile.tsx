import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { getAuth, signOut } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { updateLocation } from '../../redux/api/userAPI';
import { NavBar } from '../gameMap/NavBar';
import { Social } from './Social';

export const Profile: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data);
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
      <Social />
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
