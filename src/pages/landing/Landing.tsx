import React, { useEffect, WheelEvent } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import logoBanner from '../../assets/logoBanner.png';
import { LoginPanel } from './LoginPanel';
import { Ledger } from '../ledger/Ledger';
import { LedgerDemo } from './LedgerDemo';
import { LANDING_SCROLL_Y } from '../../redux/reducers/pageControlSlice';
import { CityDemo } from './CityDemo';
import titleLedger from '../../assets/intro_title_ledger.png';
import titleStatistics from '../../assets/intro_title_statistics.png';
import titleCoop from '../../assets/intro_title_coop.png';
import titleX from '../../assets/intro_title_x.png';
import sloganLedger from '../../assets/intro_slogan_ledger.png';
import { INTRO_SECTION_SWITCH } from '../../redux/reducers/landingIntroSlice';

export const Landing: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { landingScrollY } = useAppSelector((state) => state.pageControl);
  const { introSection } = useAppSelector((state) => state.landingIntro);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleWheel = (event: any) => {
      dispatch(LANDING_SCROLL_Y(event.deltaY));
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    const sections = ['ledger', 'statistics', 'cooperation'] as (
      | 'ledger'
      | 'statistics'
      | 'cooperation'
    )[];
    const nextIndex =
      (sections.findIndex((section) => section === introSection) + 1) % 3;
    const carouselInterval = setInterval(
      () => dispatch(INTRO_SECTION_SWITCH(sections[nextIndex])),
      3000
    );
    return () => clearInterval(carouselInterval);
  }, [introSection]);

  return (
    <Wrapper>
      <IntroSection>
        <BannerLogoWrap>
          <BannerLogo src={logoBanner} alt={'logo'} />
        </BannerLogoWrap>
        <IntroTitles>
          <TitleWrap onClick={() => dispatch(INTRO_SECTION_SWITCH('ledger'))}>
            <IntroTitleImg src={titleLedger} />
            <TitleUnderline $isShown={introSection === 'ledger'} />
          </TitleWrap>
          <IntroTitleImgX src={titleX} />
          <TitleWrap
            onClick={() => dispatch(INTRO_SECTION_SWITCH('statistics'))}
          >
            <IntroTitleImg src={titleStatistics} />
            <TitleUnderline $isShown={introSection === 'statistics'} />
          </TitleWrap>
          <IntroTitleImgX src={titleX} />
          <TitleWrap
            onClick={() => dispatch(INTRO_SECTION_SWITCH('cooperation'))}
          >
            <IntroTitleImg src={titleCoop} />
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
        >
          <Slogan src={sloganLedger} />
          <CityDemo />
          <LedgerDemo />
        </LedgerIntro>
      </IntroSection>
      <LoginSection>
        <LoginPanel />
      </LoginSection>
    </Wrapper>
  );
};

// type BlackCurtainProps = {
//   $isShown: boolean;
// };

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

const IntroSection = styled.div`
  border: 6px #f2f2f2 solid;
  background-color: rgba(242, 242, 242, 0.7);
  height: calc(100vh - 100px);
  width: 65%;
  border-radius: 80px 20px 20px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const BannerLogoWrap = styled.div``;

const BannerLogo = styled.img`
  width: 450px;
  border-radius: 20px;
  display: block;
  transform: translateX(-50px) translateY(-42px) rotate(-7deg);
  box-shadow: 5px 5px 10px #7d4e34;
`;

const LoginSection = styled(IntroSection)`
  width: 30%;
  border-radius: 20px;
  padding: 0;
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
  /* border-radius: 20px; */
  border: 2px #e6e6e6 solid;
  /* overflow: hidden; */
  height: 60%;
  display: flex;
  align-items: center;
  transition: opacity 0.5s ease, transform 1s ease;
  transform: ${({ $position }) =>
    $position === 'left'
      ? 'translateX(-50%)'
      : $position === 'middle'
      ? 'translateX(0%)'
      : 'translateX(50%)'};
  opacity: ${({ $isShown }) => ($isShown ? '1' : '0')};
`;

const Slogan = styled.img`
  position: absolute;
  top: -35px;
  left: -25px;
  z-index: 0;
  transform: rotate(-4deg) scale(0.9);
  filter: opacity(0.7);
`;

const IntroTitles = styled.div`
  margin: 0 10px 0 auto;
  transform: translateY(-20px);
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
  background-color: #ff0000;
  position: absolute;
  opacity: 0.4;
  bottom: 3px;
  display: ${({ $isShown }) => ($isShown ? 'block' : 'none')};
`;

const IntroTitleImg = styled.img`
  height: 60px;
  filter: opacity(0.8);
`;
const IntroTitleImgX = styled.img`
  height: 50px;
  filter: opacity(0.7);
`;
