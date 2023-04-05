import React from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

export function GameMap() {
  // const count = useAppSelector(selectCount);
  // const dispatch = useAppDispatch();
  // const [incrementAmount, setIncrementAmount] = useState('2');

  return (
    <div>
      <div>
        <button
          aria-label="Decrement value"
          // onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
    </div>
  );
}
