import { useEffect, useState } from 'react';
import { SHIFT_CITY_VIA_KEYBOARD } from '../../../redux/reducers/citySlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

export const useControlMayor = () => {
  const [mayorImgX, setMayorImgX] = useState(0);
  const [mayorImgY, setMayorImgY] = useState(0);
  const dispatch = useAppDispatch();
  const { isTouring } = useAppSelector((state) => state.city);

  useEffect(() => {
    const stepLength = 15;
    const directions = [
      'ArrowDown',
      'ArrowUp',
      'ArrowRight',
      'ArrowLeft',
    ] as const;
    type DirectionsState = (typeof directions)[number];
    const directionSetting = {
      ArrowDown: {
        deltaX: 0,
        deltaY: stepLength,
        mayorImgY: 0,
      },
      ArrowUp: {
        deltaX: 0,
        deltaY: -stepLength,
        mayorImgY: 1,
      },
      ArrowRight: {
        deltaX: stepLength,
        deltaY: 0,
        mayorImgY: 3,
      },
      ArrowLeft: {
        deltaX: -stepLength,
        deltaY: 0,
        mayorImgY: 2,
      },
    };
    const handelKeypress = (event: KeyboardEvent) => {
      if (directions.includes(event.code as DirectionsState)) {
        const direction = event.code as DirectionsState;
        const { deltaX, deltaY, mayorImgY } = directionSetting[direction];
        event.preventDefault();
        dispatch(SHIFT_CITY_VIA_KEYBOARD({ deltaX, deltaY }));
        setMayorImgY(mayorImgY);
        setMayorImgX((prev) => (prev + 1) % 3);
      }
    };

    if (isTouring) {
      window.addEventListener('keydown', handelKeypress);
    } else {
      window.removeEventListener('keydown', handelKeypress);
    }
    return () => {
      window.removeEventListener('keydown', handelKeypress);
    };
  }, [isTouring, dispatch]);

  return { mayorImgX, mayorImgY };
};

export default useControlMayor;
