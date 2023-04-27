import React from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { ClosingButton } from '../../component/ClosingButton';

export const Profile: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data);
  // const constId = 'myCPVIkcOYalDVvdj9hngfml3yq2'; //TODO: 要改成可變動的
  // const cooperatorLocation = useAppSelector(
  //   (state) => state.userActivity.data[constId]?.currentPage
  // );
  // const { isEditingCity, fadeOutTime, latestActiveTime } = useAppSelector(
  //   (state) => state.userActivity.data[constId]
  // );
  const dispatch = useAppDispatch();

  return (
    <Wrap>
      <ClosingButton size={60} />
    </Wrap>
  );
};

const Wrap = styled.div`
  height: 70vh;
  width: 40vw;
  position: absolute;
  right: 0;
  bottom: 100px;
  z-index: 4;
  border: #ffffff 3px solid;
  background-color: #f7f7f7;

  border-radius: 20px 20px 0 0;

  font-size: 20px;
  color: #808080;
`;
