import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { shiftPosition } from '../gameMap/gameMapSlice';

export function GameMap() {
  const arrayStat = useAppSelector((state) => state.gameMap.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <p>{arrayStat}</p>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(shiftPosition())}
        >
          -
        </button>
      </div>
    </div>
  );
}
