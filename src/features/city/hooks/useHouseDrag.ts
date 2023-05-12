import { Dispatch } from 'redux';
import { useCallback } from 'react';
import { DRAG_HOUSE_START } from '../../../redux/reducers/citySlice';

interface useHouseDragProps {
  dragMode: string;
  dispatch: Dispatch<any>;
}

const useHouseDrag = ({ dragMode, dispatch }: useHouseDragProps) => {
  const handleHouseDragStart = useCallback(
    (
      event: React.DragEvent,
      house: {
        type: string;
        id: string;
      },
      xIndex: number,
      yIndex: number
    ) => {
      if (dragMode !== 'houses') return;
      const target = event.target as HTMLDivElement;
      target.style.opacity = '0.01';
      dispatch(
        DRAG_HOUSE_START({
          id: house.id,
          target: house.type,
          pastIndex: { xIndex, yIndex },
        })
      );
    },
    [dragMode, dispatch]
  );

  const handleHouseDragEnd = useCallback(
    (event: React.DragEvent) => {
      if (dragMode !== 'houses') return;
      const target = event.target as HTMLDivElement;
      target.style.opacity = '1';
    },
    [dragMode]
  );

  return { handleHouseDragStart, handleHouseDragEnd };
};

export default useHouseDrag;
