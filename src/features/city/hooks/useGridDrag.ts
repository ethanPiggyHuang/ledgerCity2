import { Dispatch } from 'redux';
import { useCallback } from 'react';
import {
  DROP_HOUSE,
  SWITCH_GRID_LIGHT_OFF,
  SWITCH_GRID_LIGHT_ON,
} from '../../../redux/reducers/citySlice';
import useSound from 'use-sound';
import hammer_ice from '../../../assets/hammer_ice.wav';

interface useGridDragProps {
  dragMode: string;
  dispatch: Dispatch<any>;
  gridsStatus: ('available' | 'forbidden' | 'none')[][];
}

const useGridDrag = ({ dragMode, dispatch, gridsStatus }: useGridDragProps) => {
  const [playHammerShort] = useSound(hammer_ice, { volume: 0.5 });

  const handleGridDragLeave = useCallback(() => {
    if (dragMode !== 'houses') return;
    dispatch(SWITCH_GRID_LIGHT_OFF());
  }, [dragMode, dispatch]);

  const handleGridDragOver = useCallback(
    (event: React.DragEvent, xIndex: number, yIndex: number) => {
      if (dragMode !== 'houses') return;
      event.preventDefault();
      dispatch(SWITCH_GRID_LIGHT_ON({ xIndex, yIndex }));
    },
    [dragMode, dispatch]
  );

  const handleGridDrop = useCallback(
    (xIndex: number, yIndex: number) => {
      if (dragMode !== 'houses') return;
      dispatch(DROP_HOUSE({ xIndex, yIndex }));
      if (gridsStatus[yIndex][xIndex] === 'available') {
        playHammerShort();
        setTimeout(() => playHammerShort(), 500);
        setTimeout(() => playHammerShort(), 1000);
      }
    },
    [dragMode, dispatch, gridsStatus, playHammerShort]
  );

  return {
    handleGridDragLeave,
    handleGridDragOver,
    handleGridDrop,
  };
};

export default useGridDrag;
