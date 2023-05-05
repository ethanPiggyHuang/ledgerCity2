import React, { useState, useRef, useEffect } from 'react';
import useSound from 'use-sound';
import styled, { keyframes } from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  saveCityAsync,
  draggableToggle,
  CITY_SET_SHIFT,
  START_CITY_TOUR,
  END_CITY_TOUR,
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
import { Alert } from '../../component/Alert';
import {
  ALERT_DIALOUGE_TOGGLE,
  ALERT_TOGGLE,
} from '../../redux/reducers/pageControlSlice';

interface Props {
  props: HTMLDivElement | null;
}

export const RearrangeOptions: React.FC<Props> = ({ props }) => {
  const { cityList } = useAppSelector((state) => state.userInfo.data);
  const { dragMode, nextHousePosition, scale, housesPosition, isTouring } =
    useAppSelector((state) => state.cityArrangement);
  const { dataList } = useAppSelector((state) => state.ledgerList);
  const { isShown } = useAppSelector((state) => state.pageControl.alert);
  const { gridLength, cityPaddingX, cityPaddingY } = citySetting;
  const dispatch = useAppDispatch();
  const [isMusicPlay, setIsMusicPlay] = useState(false);
  const [playHammer, { stop }] = useSound(hammer_2, { volume: 0.8 });

  const cityId = cityList[0];

  const audioRef = useRef<HTMLAudioElement>(null);

  const [show, setShow] = useState(true);

  // useEffect(() => {
  // if (props) console.log('props', props);
  // }, []);

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

  const handleFocusCityHall = (scale: number) => {
    let hallPosition = { yIndex: 0, xIndex: 0 };
    housesPosition.forEach((raw, yIndex) =>
      raw.forEach((house, xIndex) => {
        if (house.type === '市政廳')
          hallPosition = { ...hallPosition, yIndex, xIndex };
      })
    );
    const hallShiftX = (hallPosition.xIndex + 0.5) * gridLength * scale;
    const hallShiftY = (hallPosition.yIndex + 0.5) * gridLength * scale;

    dispatch(CITY_SET_SHIFT({ shiftX: hallShiftX, shiftY: hallShiftY }));
  };

  const handleStartCityTour = () => {
    let hallPosition = { yIndex: 0, xIndex: 0 };
    housesPosition.forEach((raw, yIndex) =>
      raw.forEach((house, xIndex) => {
        if (house.type === '市政廳') {
          hallPosition = { ...hallPosition, yIndex, xIndex };
        }
      })
    );
    const newScale = 2;
    const hallShiftX = (hallPosition.xIndex + 0.5) * gridLength * newScale;
    const hallShiftY =
      (hallPosition.yIndex + 0.5 + 3 / 8) * gridLength * newScale;
    dispatch(CITY_SET_SHIFT({ shiftX: hallShiftX, shiftY: hallShiftY }));
    dispatch(SET_SCALE(2));
    setTimeout(() => {
      dispatch(START_CITY_TOUR());
    }, 800);
  };

  const handleEndCityTour = () => {
    let hallPosition = { yIndex: 0, xIndex: 0 };
    housesPosition.forEach((raw, yIndex) =>
      raw.forEach((house, xIndex) => {
        if (house.type === '市政廳') {
          hallPosition = { ...hallPosition, yIndex, xIndex };
        }
      })
    );
    const newScale = 1;
    const shiftX =
      -cityPaddingX +
      window.innerWidth / 2 -
      (hallPosition.xIndex + 0.5) * gridLength * newScale;
    const shiftY =
      -cityPaddingY +
      window.innerHeight / 2 -
      (hallPosition.yIndex + 0.5 + 6 / 16) * gridLength * newScale;
    dispatch(CITY_SET_SHIFT({ shiftX, shiftY }));
    dispatch(END_CITY_TOUR());
  };

  // TODO: 只在第一次進入遊戲時 redirect
  // useEffect(() => {
  //   handleRedirectCityHall();
  // }, [housesPosition]);

  useEffect(() => {
    const { xIndex, yIndex } = nextHousePosition;
    if (housesPosition.flat(2).length !== 1) {
      if (housesPosition[yIndex]) {
        if (housesPosition[yIndex][xIndex]) {
          if (
            housesPosition[yIndex][xIndex].type !== '' ||
            (xIndex === 0 && yIndex === 0)
          ) {
            dispatch(GENERATE_AVAILABLE_POSITION());
          }
        } else {
          dispatch(GENERATE_AVAILABLE_POSITION());
        }
      } else {
        dispatch(GENERATE_AVAILABLE_POSITION());
      }
    }
  }, [dispatch, nextHousePosition, housesPosition, dataList]);

  const handleAlert = () => {
    alert('hey');
  };

  return (
    <>
      <Wrapper $isFolded={isTouring}>
        {/* TODO */}
        {/* <IconImage src={iconReconstruct} onClick={() => setShow(!show)} /> */}
        {show && (
          <>
            <Title>城市經營</Title>
            <IconsWrapper>
              <IconBack $isActivate={false} onClick={handleRescale}>
                <ScaleText>{`${scale} x`}</ScaleText>
              </IconBack>
              <IconBack
                $isActivate={false}
                onClick={() => {
                  handleFocusCityHall(scale);
                }}
              >
                <Icon icon={faLandmarkDome} />
              </IconBack>
              <IconBackLongActive
                $isActivate={dragMode === 'houses'}
                onClick={handleConstruction}
              >
                {dragMode === 'houses' ? (
                  <Icon icon={faFloppyDisk} />
                ) : (
                  <IconImg src={reconstruct} />
                )}
              </IconBackLongActive>

              <IconBackLongActive
                $isActivate={isTouring}
                onClick={() => {
                  if (!isTouring) {
                    handleStartCityTour();
                  } else {
                    handleEndCityTour();
                  }
                }}
              >
                <Icon icon={faPersonThroughWindow} />
              </IconBackLongActive>

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
        <button
          onClick={() => {
            dispatch(ALERT_TOGGLE());
            setTimeout(() => dispatch(ALERT_DIALOUGE_TOGGLE()), 200);
          }}
        >
          alert
        </button>
        {isShown && <Alert title="hi" text="hi" handleAlert={handleAlert} />}
        <audio src={chocolate_world} preload={'metadata'} loop ref={audioRef} />
      </Wrapper>
      <IconBackTouring
        $isActivate={isTouring}
        $isTouring={isTouring}
        onClick={() => {
          handleEndCityTour();
          handleFocusCityHall(1);
          dispatch(SET_SCALE(1));
        }}
      >
        <Icon icon={faPersonThroughWindow} />
      </IconBackTouring>
    </>
  );
};

type IconBackProps = {
  $isActivate: boolean;
};

type IconBackTouringProps = {
  $isActivate: boolean;
  $isTouring: boolean;
};

type WrapperProps = {
  $isFolded: boolean;
};

const Wrapper = styled.div<WrapperProps>`
  position: fixed;
  z-index: 4;
  left: 50px;
  top: 180px;
  display: flex;
  flex-direction: column;
  gap: 17px;
  transition: transform 1s ease;
  transform: ${({ $isFolded }) => ($isFolded ? 'translateX(-200%)' : '')};
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

const IconBackLongActive = styled(IconBack)`
  animation: ${({ $isActivate }) => ($isActivate ? active : '')} 0.6s infinite
    alternate;
`;

const IconBackTouring = styled.div<IconBackTouringProps>`
  width: 44px;
  height: 44px;
  border-radius: 33px;
  display: flex;
  /* opacity: ${({ $isTouring }) => ($isTouring ? '0.5' : '0')}; */
  justify-content: center;
  align-items: center;
  background-color: black;
  box-shadow: 3px black solid;
  opacity: ${({ $isActivate }) => ($isActivate ? '1' : '0')};
  position: absolute;
  top: 54vh;
  left: 50px;
  cursor: pointer;
  transition: 1s ease;
  transform: ${({ $isTouring }) => ($isTouring ? 'translateY(33vh)' : '')};
  &:hover {
    opacity: ${({ $isActivate }) => ($isActivate ? '1' : '0.7')};
  }
  &:active {
    transform: translateY(3px);
  }
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
  font-size: 16px;
  color: #f2f2f2;
`;

const IconImage = styled.img`
  height: 200px;
  cursor: pointer;
  &:hover {
    transform: translateY(-10px);
  }
`;
