import React from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  saveCityAsync,
  draggableToggle,
} from '../../redux/reducers/cityArrangementSlice';

export const RearrangeOptions: React.FC = () => {
  const { isHouseDraggable } = useAppSelector((state) => state.cityArrangement);
  const { houses } = useAppSelector((state) => state.cityBasicInfo);
  const dispatch = useAppDispatch();

  return (
    <Wrapper>
      <button
        onClick={() => {
          isHouseDraggable
            ? dispatch(saveCityAsync(houses)) //TODO: can get state info directly in reducer
            : dispatch(draggableToggle());
        }}
      >
        {isHouseDraggable ? '儲存' : '街道重建'}
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 20px;
  left: calc(50vw - 75px);
  width: 150px;
`;
