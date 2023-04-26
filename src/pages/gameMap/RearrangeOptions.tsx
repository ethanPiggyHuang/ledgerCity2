import React, { useState, useRef } from 'react';
import useSound from 'use-sound';
import styled, { keyframes } from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  saveCityAsync,
  draggableToggle,
} from '../../redux/reducers/cityArrangementSlice';
import chocolate_world from '../../assets/chocolate_world.mp3';
import hammer_2 from '../../assets/hammer_2.wav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeHigh,
  faVolumeXmark,
  faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';
import reconstruct from '../../assets/reconstruct.png';
import { SET_SCALE } from '../../redux/reducers/cityArrangementSlice';

export const RearrangeOptions: React.FC = () => {
  const { dragMode } = useAppSelector((state) => state.cityArrangement);
  const { scale } = useAppSelector((state) => state.cityArrangement);
  const dispatch = useAppDispatch();
  const [isMusicPlay, setIsMusicPlay] = useState(false);
  const [playHammer, { stop }] = useSound(hammer_2, { volume: 0.8 });

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleConstruction = () => {
    if (dragMode === 'houses') {
      dispatch(saveCityAsync());
      playHammer();
    } else {
      dispatch(draggableToggle());
    }
  };

  const handleMusicToggle = () => {
    if (!audioRef.current) return;
    if (!isMusicPlay) {
      audioRef.current.play();
      setIsMusicPlay(true);
    } else {
      audioRef.current.pause();
      setIsMusicPlay(false);
    }
  };

  const handleRescale = () => {
    const scaleOptions = [0.5, 1, 2];

    const nextScaleIndex =
      (scaleOptions.findIndex((option) => option === scale) + 1) %
      scaleOptions.length;

    dispatch(SET_SCALE(scaleOptions[nextScaleIndex]));

    console.log(nextScaleIndex);
  };

  return (
    <Wrapper>
      <Title>城市經營</Title>
      <IconsWrapper>
        <IconBackConstruction
          $isActivate={dragMode === 'houses'}
          onClick={handleConstruction}
        >
          {dragMode === 'houses' ? (
            <Icon icon={faFloppyDisk} />
          ) : (
            <IconImg src={reconstruct} />
          )}
        </IconBackConstruction>
        <IconBack $isActivate={false} onClick={handleRescale}>
          <ScaleText>{`${scale} x`}</ScaleText>
        </IconBack>
        <IconBack $isActivate={isMusicPlay} onClick={handleMusicToggle}>
          <Icon icon={isMusicPlay ? faVolumeHigh : faVolumeXmark} />
        </IconBack>
      </IconsWrapper>

      <audio src={chocolate_world} preload={'metadata'} loop ref={audioRef} />
    </Wrapper>
  );
};

type IconBackProps = {
  $isActivate: boolean;
};

const Wrapper = styled.div`
  position: fixed;
  z-index: 4;
  left: 50px;
  top: 180px;
  display: flex;
  flex-direction: column;
  gap: 17px;
`;

const Title = styled.div`
  font-size: 20px;
  letter-spacing: 16%;
  color: #ae7a00;
  font-weight: bold;
`;

const IconsWrapper = styled.div`
  display: flex;
  gap: 17px;
`;

const IconBack = styled.div<IconBackProps>`
  width: 66px;
  height: 66px;
  border-radius: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  opacity: ${({ $isActivate }) => ($isActivate ? '1' : '0.5')};
  cursor: pointer;
`;

const active = keyframes`
  from {
    border: 0px #f2f2f2 solid;
  }
  to{
    border: 4px #f2f2f2 solid;
  }
`;

const IconBackConstruction = styled(IconBack)`
  animation: ${({ $isActivate }) => ($isActivate ? active : '')} 0.6s infinite
    alternate;
`;

const Icon = styled(FontAwesomeIcon)`
  color: #f2f2f2;
  font-size: 36px;
`;

const IconImg = styled.img`
  height: 47px;
`;

const ScaleText = styled.p`
  font-size: 24px;
  color: #f2f2f2;
`;
