import React, { useState, useRef, useEffect } from 'react';
import useSound from 'use-sound';
import styled, { keyframes } from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  saveCityAsync,
  draggableToggle,
  CITY_SET_SHIFT,
} from '../../redux/reducers/cityArrangementSlice';
import chocolate_world from '../../assets/chocolate_world.mp3';
import hammer_2 from '../../assets/hammer_2.wav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeHigh,
  faVolumeXmark,
  faFloppyDisk,
  faLandmarkDome,
  faPersonThroughWindow,
} from '@fortawesome/free-solid-svg-icons';
import reconstruct from '../../assets/reconstruct.png';
import {
  SET_SCALE,
  GENERATE_AVAILABLE_POSITION,
} from '../../redux/reducers/cityArrangementSlice';
import iconReconstruct from '../../assets/iconReconstruct.png';
import { citySetting } from '../../utils/gameSettings';

export const RearrangeOptions: React.FC = () => {
  const { dragMode, nextHousePosition, scale, housesPosition } = useAppSelector(
    (state) => state.cityArrangement
  );
  const { dataList } = useAppSelector((state) => state.ledgerList);
  const { gridLength, cityPaddingX, cityPaddingY } = citySetting;
  const dispatch = useAppDispatch();
  const [isMusicPlay, setIsMusicPlay] = useState(false);
  const [playHammer, { stop }] = useSound(hammer_2, { volume: 0.8 });

  const audioRef = useRef<HTMLAudioElement>(null);

  const [show, setShow] = useState(true);

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
  };

  const handleRedirectCityHall = () => {
    let hallPosition = { yIndex: 0, xIndex: 0 };
    housesPosition.forEach((raw, yIndex) =>
      raw.forEach((house, xIndex) => {
        if (house.type === '市政廳') {
          hallPosition = { ...hallPosition, yIndex, xIndex };
        }
      })
    );

    dispatch(
      CITY_SET_SHIFT({
        shiftX:
          -cityPaddingX +
          window.innerWidth / 2 -
          (hallPosition.xIndex + 0.5) * gridLength * scale,
        shiftY:
          -cityPaddingY +
          window.innerHeight / 2 -
          (hallPosition.yIndex + 0.5) * gridLength * scale,
      })
    );
  };

  // TODO: 只在第一次進入遊戲時 redirect
  // useEffect(() => {
  //   handleRedirectCityHall();
  // }, [housesPosition]);

  useEffect(() => {
    const { xIndex, yIndex } = nextHousePosition;
    if (housesPosition.length !== 0) {
      if (
        housesPosition[yIndex][xIndex].type !== '' ||
        (xIndex === 0 && yIndex === 0)
      ) {
        dispatch(GENERATE_AVAILABLE_POSITION());
        dispatch(GENERATE_AVAILABLE_POSITION());
      }
    }
  }, [dispatch, nextHousePosition, housesPosition, dataList]);

  return (
    <Wrapper>
      {/* TODO */}
      {/* <IconImage src={iconReconstruct} onClick={() => setShow(!show)} /> */}
      {show && (
        <>
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
            <IconBack $isActivate={false} onClick={handleRedirectCityHall}>
              <Icon icon={faLandmarkDome} />
            </IconBack>
            <IconBack $isActivate={false} onClick={handleRedirectCityHall}>
              <Icon icon={faPersonThroughWindow} />
            </IconBack>
            <IconBack $isActivate={isMusicPlay} onClick={handleMusicToggle}>
              <Icon icon={isMusicPlay ? faVolumeHigh : faVolumeXmark} />
            </IconBack>
            {/* <button
              onClick={() => {
                dispatch(GENERATE_AVAILABLE_POSITION());
                dispatch(
                  CITY_SET_SHIFT({
                    shiftX:
                      -cityPaddingX +
                      window.innerWidth / 2 -
                      (nextHousePosition.xIndex + 0.5) * gridLength * scale,
                    shiftY:
                      -cityPaddingY +
                      window.innerHeight / 2 -
                      (nextHousePosition.yIndex + 0.5) * gridLength * scale,
                  })
                );
              }}
            >
              {`${nextHousePosition.xIndex},${nextHousePosition.yIndex}`}
            </button> */}
          </IconsWrapper>
        </>
      )}
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
  flex-wrap: wrap;
  width: 50px;
  gap: 10px;
`;

const IconBack = styled.div<IconBackProps>`
  width: 44px;
  height: 44px;
  border-radius: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  box-shadow: 3px black solid;
  opacity: ${({ $isActivate }) => ($isActivate ? '1' : '0.5')};
  cursor: pointer;
  &:hover {
    opacity: ${({ $isActivate }) => ($isActivate ? '1' : '0.7')};
  }
  &:active {
    transform: translateY(3px);
  }
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
  font-size: 22px;
`;

const IconImg = styled.img`
  height: 34px;
`;

const ScaleText = styled.p`
  font-size: 20px;
  color: #f2f2f2;
`;

const IconImage = styled.img`
  height: 200px;
  cursor: pointer;
  &:hover {
    transform: translateY(-10px);
  }
`;
