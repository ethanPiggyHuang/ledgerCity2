import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import sloganCooperation from '../../assets/intro_slogan_coop.png';
import sloganLedger from '../../assets/intro_slogan_ledger.png';
import sloganStatistics from '../../assets/intro_slogan_statistics.png';
import titleCoop from '../../assets/intro_title_coop.png';
import titleLedger from '../../assets/intro_title_ledger.png';
import titleStatistics from '../../assets/intro_title_statistics.png';
import titleX from '../../assets/intro_title_x.png';
import logoBanner from '../../assets/logoBanner.png';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  SWITCH_INTRO_SECTION,
  TOGGLE_CAROUSEL_PLAYING,
} from '../../redux/reducers/landingIntroSlice';
import { CityDemo } from './CityDemo';
import { CoopDemo } from './CoopDemo';
import { LedgerDemo } from './LedgerDemo';
import { LoginPanel } from './LoginPanel';
import { StatisticsDemo } from './StatisticsDemo';
import { useNavigate } from 'react-router-dom';

export const Landing: React.FC = () => {
  const { introSection, isPlayingCarousel, isFocusingLogin } = useAppSelector(
    (state) => state.landingIntro
  );
  const { userId } = useAppSelector((state) => state.userInfo.data);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sections = ['ledger', 'statistics', 'cooperation'] as (
      | 'ledger'
      | 'statistics'
      | 'cooperation'
    )[];
    const nextIndex =
      (sections.findIndex((section) => section === introSection) + 1) % 3;
    if (isPlayingCarousel) {
      const carouselInterval = setInterval(
        () => dispatch(SWITCH_INTRO_SECTION(sections[nextIndex])),
        5000
      );
      return () => clearInterval(carouselInterval);
    }
  }, [introSection, isPlayingCarousel, dispatch]);

  useEffect(() => {
    if (userId) navigate('/city');
  }, [userId]);

  return (
    <Wrapper>
      <BannerLogoWrap>
        <BannerLogo src={logoBanner} alt={'logo'} />
      </BannerLogoWrap>
      <IntroSection $isFocus={!isFocusingLogin}>
        <IntroTitles>
          <TitleWrap
            onClick={() => {
              dispatch(SWITCH_INTRO_SECTION('ledger'));
              dispatch(TOGGLE_CAROUSEL_PLAYING(false));
            }}
          >
            <IntroTitleImg
              src={titleLedger}
              $isShown={introSection === 'ledger'}
            />
            <TitleUnderline $isShown={introSection === 'ledger'} />
          </TitleWrap>
          <IntroTitleImgX src={titleX} />
          <TitleWrap
            onClick={() => {
              dispatch(SWITCH_INTRO_SECTION('statistics'));
              dispatch(TOGGLE_CAROUSEL_PLAYING(false));
            }}
          >
            <IntroTitleImg
              src={titleStatistics}
              $isShown={introSection === 'statistics'}
            />
            <TitleUnderline $isShown={introSection === 'statistics'} />
          </TitleWrap>
          <IntroTitleImgX src={titleX} />
          <TitleWrap
            onClick={() => {
              dispatch(SWITCH_INTRO_SECTION('cooperation'));
              dispatch(TOGGLE_CAROUSEL_PLAYING(false));
            }}
          >
            <IntroTitleImg
              src={titleCoop}
              $isShown={introSection === 'cooperation'}
            />
            <TitleUnderline $isShown={introSection === 'cooperation'} />
          </TitleWrap>
        </IntroTitles>

        <LedgerIntro
          $isShown={introSection === 'ledger'}
          $position={
            introSection === 'ledger'
              ? 'middle'
              : introSection === 'statistics'
              ? 'right'
              : 'left'
          }
          onMouseEnter={() => dispatch(TOGGLE_CAROUSEL_PLAYING(false))}
          onMouseLeave={() => dispatch(TOGGLE_CAROUSEL_PLAYING(true))}
        >
          <Slogan src={sloganLedger} />
          <CityDemo />
          <LedgerDemo />
        </LedgerIntro>

        <StatisticsIntro
          $isShown={introSection === 'statistics'}
          $position={
            introSection === 'statistics'
              ? 'middle'
              : introSection === 'cooperation'
              ? 'right'
              : 'left'
          }
          onMouseEnter={() => dispatch(TOGGLE_CAROUSEL_PLAYING(false))}
          onMouseLeave={() => dispatch(TOGGLE_CAROUSEL_PLAYING(true))}
        >
          <SloganStatistics src={sloganStatistics} />
          <StatisticsDemo />
        </StatisticsIntro>
        <CoopIntro
          $isShown={introSection === 'cooperation'}
          $position={
            introSection === 'cooperation'
              ? 'middle'
              : introSection === 'ledger'
              ? 'right'
              : 'left'
          }
          onMouseEnter={() => dispatch(TOGGLE_CAROUSEL_PLAYING(false))}
          onMouseLeave={() => dispatch(TOGGLE_CAROUSEL_PLAYING(true))}
        >
          <SloganCoop src={sloganCooperation} />
          <CoopDemo />
        </CoopIntro>
      </IntroSection>
      <LoginSection $isFocus={isFocusingLogin}>
        <LoginPanel />
      </LoginSection>
    </Wrapper>
  );
};

type LandingSectionProps = {
  $isFocus: boolean;
};

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  background: linear-gradient(#c8e2cc, #98d5da);
  overflow: hidden;
  padding: 60px 100px 40px;
  display: flex;
  gap: 5%;
`;

const IntroSection = styled.div<LandingSectionProps>`
  border: 6px #f2f2f2 solid;
  background-color: rgba(242, 242, 242, 0.7);
  height: calc(100vh - 100px);
  width: 65%;
  border-radius: 80px 20px 20px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: hidden;
  transition: opacity 0.5s ease;
  opacity: ${({ $isFocus }) => ($isFocus ? '1' : '0.6')};
`;

const BannerLogoWrap = styled.div`
  position: absolute;
  z-index: 2;
`;

const BannerLogo = styled.img`
  width: 450px;
  border-radius: 20px;
  display: block;
  transform: translateX(-50px) translateY(-8px) rotate(-7deg);
  box-shadow: 5px 5px 10px #7d4e34;
`;

const LoginSection = styled(IntroSection)<LandingSectionProps>`
  width: 30%;
  border-radius: 20px;
  padding: 0;
  transition: opacity 0.5s ease;
  opacity: ${({ $isFocus }) => ($isFocus ? '1' : '0.6')};
`;

type IntroSectionProps = {
  $isShown: boolean;
  $position?: 'left' | 'middle' | 'right';
};

const LedgerIntro = styled.div<IntroSectionProps>`
  position: absolute;
  width: calc(100% - 40px);
  bottom: 20px;
  padding: 20px;
  background-color: #f2f2f2;
  box-shadow: 5px 5px 5px #808080;
  border: 2px #e6e6e6 solid;
  height: 60%;
  display: flex;
  align-items: center;
  transition: opacity 1s ease, transform 1s ease;
  transform: ${({ $position }) =>
    $position === 'left'
      ? 'translateX(-100%)'
      : $position === 'middle'
      ? 'translateX(0%)'
      : 'translateX(100%)'};
  opacity: ${({ $isShown }) => ($isShown ? '1' : '0')};
`;

const StatisticsIntro = styled(LedgerIntro)``;

const CoopIntro = styled(LedgerIntro)``;

const Slogan = styled.img`
  position: absolute;
  top: -35px;
  left: -25px;
  z-index: 0;
  transform: rotate(-4deg) scale(0.9);
  filter: opacity(0.7);
`;
const SloganStatistics = styled(Slogan)`
  top: -150px;
  transform: rotate(0deg) scale(0.4) translateX(130%);
`;
const SloganCoop = styled(Slogan)`
  top: -170px;
  transform: rotate(-12deg) scale(0.4) translateX(-70%);
`;

const IntroTitles = styled.div`
  margin: 100px 10px 0 auto;
  display: flex;
  align-items: end;
`;

const TitleWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const TitleUnderline = styled.div<IntroSectionProps>`
  width: 100px;
  height: 15px;
  border-radius: 10px;
  z-index: -1;
  background-color: #ff4e4e;
  position: absolute;
  bottom: 3px;
  transition: opacity 1s ease;
  opacity: ${({ $isShown }) => ($isShown ? '1' : '0')};
`;

const IntroTitleImg = styled.img<IntroSectionProps>`
  height: 60px;
  filter: ${({ $isShown }) => ($isShown ? 'opacity(1)' : 'opacity(0.8)')};
  &:hover {
    filter: opacity(1);
  }
`;
const IntroTitleImgX = styled.img`
  height: 50px;
  filter: opacity(0.7);
`;
