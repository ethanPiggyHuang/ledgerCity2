import React from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  saveCityAsync,
  draggableToggle,
} from '../../redux/reducers/cityArrangementSlice';

export const SideBar: React.FC = () => {
  const auth = getAuth();
  const { userId } = useAppSelector((state) => state.userInfo.data.user);

  const constId = 'myCPVIkcOYalDVvdj9hngfml3yq2'; //TODO: 要改成可變動的
  const cooperatorLocation = useAppSelector(
    (state) => state.userActivity.data[constId]?.currentPage
  );
  const { isEditingCity, fadeOutTime, latestActiveTime } = useAppSelector(
    (state) => state.userActivity.data[constId]
  );

  const { isHouseDraggable } = useAppSelector((state) => state.cityArrangement);
  const { houses } = useAppSelector((state) => state.cityBasicInfo);

  const dispatch = useAppDispatch();

  return (
    <>
      <button
        onClick={() => {
          isHouseDraggable
            ? dispatch(saveCityAsync(houses)) //TODO: can get state info directly in reducer
            : dispatch(draggableToggle());
        }}
      >
        {isHouseDraggable ? '儲存' : '街道重建'}
      </button>
      <br />
      <Link to="/ledger">ledger</Link>
      <br />
      <br />
      <Link to="/statistics">statistics</Link>
      <br />
      <br />
      <button onClick={() => signOut(auth)}>Sign out</button>
      <br />
      <br />
      <p>{`userId: ${userId}`}</p>
      <p>{`locatiton: ${cooperatorLocation}`}</p>
      <p>{`isEditingCity: ${isEditingCity}`}</p>
      <p>{`fadeOutTime: ${fadeOutTime ? new Date(fadeOutTime * 1000) : ''}`}</p>
      <p>{`latestActiveTime: ${
        latestActiveTime ? new Date(latestActiveTime * 1000) : ''
      }`}</p>
    </>
  );
};
