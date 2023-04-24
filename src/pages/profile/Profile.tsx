import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { updateLocation } from '../../redux/api/userAPI';
import { NavBar } from '../gameMap/NavBar';
import { Social } from './Social';
import { Setting } from './Setting';
import { Account } from './Account';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { SWITCH_PAGE } from '../../redux/reducers/pageControlSlice';

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

  // 監聽使用者進入頁面 -> 送到 db
  useEffect(() => {
    if (userId) {
      updateLocation(userId, 'profile');
    }
  }, [userId]);

  return (
    <Wrap>
      <CrossIconWrap onClick={() => dispatch(SWITCH_PAGE('city'))}>
        <CrossIcon icon={faXmark} />
      </CrossIconWrap>
      <Account />
      <Social />
      <Setting />
    </Wrap>
  );
};

const Wrap = styled.div`
  height: 70vh;
  width: 40vw;
  transform: translateX(75%);
  position: absolute;
  bottom: 100px;
  z-index: 4;
  border: #ffffff 3px solid;
  background-color: #f7f7f7;

  border-radius: 20px 20px 0 0;

  font-size: 20px;
  color: #808080;
`;

const CrossIconWrap = styled.div`
  // position: absolute;
  left: 21px;
  height: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const CrossIcon = styled(FontAwesomeIcon)`
  height: 27px;
  color: #808080;
`;
