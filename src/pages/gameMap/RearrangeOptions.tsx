import React, { useState, useRef } from 'react';
import useSound from 'use-sound';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  saveCityAsync,
  draggableToggle,
} from '../../redux/reducers/cityArrangementSlice';
import chocolate_world from '../../utils/chocolate_world.mp3';
import hammer_2 from '../../utils/hammer_2.wav';

export const RearrangeOptions: React.FC = () => {
  const { dragMode } = useAppSelector((state) => state.cityArrangement);
  const { houses } = useAppSelector((state) => state.cityBasicInfo);
  const dispatch = useAppDispatch();
  const [isMusicPlay, setIsMusicPlay] = useState(false);
  const [playHammer] = useSound(hammer_2, { volume: 0.8 });

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleConstruction = () => {
    if (dragMode === 'houses') {
      dispatch(saveCityAsync(houses)); //TODO: can get state info directly in reducer
      playHammer();
      // setTimeout(() => stop(), 1000);
    } else {
      dispatch(draggableToggle());
    }
  };

  return (
    <Wrapper>
      <audio src={chocolate_world} preload={'metadata'} loop ref={audioRef} />
      <button
        onClick={() => {
          if (!audioRef.current) return;
          if (!isMusicPlay) {
            audioRef.current.play();
            setIsMusicPlay(true);
          } else {
            audioRef.current.pause();
            setIsMusicPlay(false);
          }
        }}
      >
        {isMusicPlay ? '暫停BGM' : '播放BGM'}
      </button>
      <span>音量：</span>
      <button
        onClick={() => {
          if (!audioRef.current) return;
          audioRef.current.volume = 1;
        }}
      >
        大
      </button>
      <button
        onClick={() => {
          if (!audioRef.current) return;
          audioRef.current.volume = 0.4;
        }}
      >
        小
      </button>
      <p />
      <button onClick={handleConstruction}>
        {dragMode === 'houses' ? '儲存' : '街道重建'}
      </button>
      {/* <audio
        src={chocolate_world}
        controls
        loop={true}
        onPlay={() => {
          console.log('palying');
        }}
      /> */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 20px;
  left: calc(50vw - 75px);
  width: 300px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;
