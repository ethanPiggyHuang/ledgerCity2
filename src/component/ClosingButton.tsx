import React from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { SWITCH_PAGE } from '../redux/reducers/pageControlSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface Props {
  size: number;
}

export const ClosingButton: React.FC<Props> = ({ size }) => {
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const dispatch = useAppDispatch();

  return (
    <CrossIconWrap
      $size={size}
      onClick={() => dispatch(SWITCH_PAGE({ userId, pageActivity: 'city' }))}
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
  /* border: 1px black solid; */
`;
const CrossIcon = styled(FontAwesomeIcon)`
  height: 27px;
  color: #808080;
`;
