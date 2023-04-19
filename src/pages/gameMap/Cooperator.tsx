import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { GET_COOP_FRIEND_ACTIVITY } from '../../redux/reducers/usersActivitySlice';

export const Social: React.FC = () => {
  // const { userId } = useAppSelector((state) => state.userInfo.data);
  // const constId = 'myCPVIkcOYalDVvdj9hngfml3yq2'; //TODO: 要改成可變動的
  // const cooperatorLocation = useAppSelector(
  //   (state) => state.userActivity.data[constId]?.currentPage
  // );
  // const { isEditingCity, fadeOutTime, latestActiveTime } = useAppSelector(
  //   (state) => state.userActivity.data[constId]
  // );
  // const dispatch = useAppDispatch();

  // // 監聽好友動態（一人）
  // useEffect(() => {
  //   if (userId) {
  //     const unsubscribe = onSnapshot(
  //       doc(db, 'allUserStatus', userId),
  //       (doc) => {
  //         if (doc) {
  //           const data = doc.data();
  //           if (data) {
  //             const { fadeOutTime, isEditingCity, latestActiveTime } = data;
  //             const fadeOutTimeSecond = fadeOutTime?.seconds;
  //             const latestActiveTimeSecond = latestActiveTime?.seconds;
  //             const currentPage = data?.currentPage as
  //               | 'city'
  //               | 'ledger'
  //               | 'statistics'
  //               | 'profile'
  //               | 'leave';
  //             dispatch(
  //               GET_COOP_FRIEND_ACTIVITY({
  //                 userId,
  //                 currentPage,
  //                 isEditingCity,
  //                 fadeOutTimeSecond,
  //                 latestActiveTimeSecond,
  //               })
  //             );
  //           }
  //         }
  //       }
  //     );

  //     // Stop listening to changes
  //     return () => unsubscribe();
  //   }
  // }, [userId]);

  return (
    <Wrap>
      {/* <p>{`userId: ${userId}`}</p>
      <p>{`locatiton: ${cooperatorLocation}`}</p>
      <p>{`isEditingCity: ${isEditingCity}`}</p>
      <p>{`fadeOutTime: ${fadeOutTime ? new Date(fadeOutTime * 1000) : ''}`}</p>
      <p>{`latestActiveTime: ${
        latestActiveTime ? new Date(latestActiveTime * 1000) : ''
      }`}</p> */}
    </Wrap>
  );
};

const Wrap = styled.div`
  padding: 20px;
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
