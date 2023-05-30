import { Dispatch } from 'redux';
import { useCallback } from 'react';
import { DRAG_HOUSE_START } from '../../../redux/reducers/citySlice';
import { RefObject } from 'react';

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
      yIndex: number,
      houseRef: RefObject<HTMLDivElement>
    ) => {
      if (dragMode !== 'houses') return;
      const target = event.target as HTMLDivElement;
      target.style.opacity = '0.01';
      // if (houseRef.current) {
      //   console.log('DragStart', houseRef.current);
      //   houseRef.current.style.opacity = '0.1';
      // }
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
    (event: React.DragEvent, houseRef: RefObject<HTMLDivElement>) => {
      if (dragMode !== 'houses') return;
      // console.log('DragEnd', houseRef.current);
      const target = event.target as HTMLDivElement;
      target.style.opacity = '1';
      // if (houseRef.current) {
      //   houseRef.current.style.opacity = '1';
      // }
    },
    [dragMode]
  );

  return { handleHouseDragStart, handleHouseDragEnd };
};

export default useHouseDrag;
