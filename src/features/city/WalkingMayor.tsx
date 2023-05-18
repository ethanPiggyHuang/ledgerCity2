import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import mayorCycle from '../../assets/mayor_cycle.png';
import { useAppSelector } from '../../redux/hooks';
import { citySetting } from '../../utils/gameSettings';
import useControlMayor from './hooks/useControlMayor';

export const WalkingMayor: React.FC = () => {
  const { mayorSize } = citySetting;
  const { scale } = useAppSelector((state) => state.city);
  const { mayorImgX, mayorImgY } = useControlMayor();

  return (
    <CharacterWrap
      $widthAttrs={`${scale * mayorSize.width}px`}
      $heightAttrs={`${scale * mayorSize.height}px`}
    >
      <Character
        src={mayorCycle}
        $xIndex={mayorImgX}
        $yIndex={mayorImgY}
        $scale={scale}
      />
    </CharacterWrap>
  );
};

type CharacterWrapProps = {
  $widthAttrs: string;
  $heightAttrs: string;
};

const enterCity = keyframes`
  0%{
    transform: scale(5) translateY(-50vh);
  }
  100%{
    transform: scale(1) translateY(0);
  }
`;

const CharacterWrap = styled.div.attrs<CharacterWrapProps>(
  ({ $heightAttrs, $widthAttrs }) => ({
    style: {
      width: $widthAttrs,
      height: $heightAttrs,
    },
  })
)<CharacterWrapProps>`
  position: fixed;
  top: calc(50vh - 25px);
  left: calc(50vw - 25px);
  overflow: hidden;
  z-index: 3;
  animation: ${enterCity} 4s 1;
`;
type CharacterProps = {
  $xIndex: number;
  $yIndex: number;
  $scale: number;
};
const Character = styled.img<CharacterProps>`
  height: 400%;
  position: relative;
  left: ${({ $xIndex, $scale }) => `${(-20 - 27 * $xIndex) * $scale}px`};
  top: ${({ $yIndex, $scale }) => `${-30 * $yIndex * $scale}px`};
`;
