import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { TOGGLE_HOUSE_ADDING_MODE } from '../redux/reducers/citySlice';
import { SWITCH_SECTION_FOCUSED } from '../redux/reducers/pageControlSlice';

interface Props {
  size: number;
}

export const ClosingButton: React.FC<Props> = ({ size }) => {
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const dispatch = useAppDispatch();

  return (
    <CrossIconWrap
      $size={size}
      onClick={() => {
        dispatch(SWITCH_SECTION_FOCUSED({ userId, pageActivity: 'city' }));
        dispatch(TOGGLE_HOUSE_ADDING_MODE(false));
      }}
    >
      <CrossIcon icon={faXmark} />
    </CrossIconWrap>
  );
};

type CrossIconWrapProps = {
  $size: number;
};

const CrossIconWrap = styled.div<CrossIconWrapProps>`
  position: absolute;
  left: 0;
  height: ${({ $size }) => `${$size}px`};
  width: ${({ $size }) => `${$size}px`};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const CrossIcon = styled(FontAwesomeIcon)`
  height: 27px;
  color: #808080;
`;
