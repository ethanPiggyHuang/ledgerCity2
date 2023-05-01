import React, { useEffect, WheelEvent } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import logoBanner from '../../assets/logoBanner.png';
import { LoginPanel } from './LoginPanel';
import { Ledger } from '../ledger/Ledger';
import { LedgerDemo } from './LedgerDemo';
import { LANDING_SCROLL_Y } from '../../redux/reducers/pageControlSlice';
import { CityDemo } from './CityDemo';

export const Landing: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data);
  const { landingScrollY } = useAppSelector((state) => state.pageControl);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleWheel = (event: any) => {
      dispatch(LANDING_SCROLL_Y(event.deltaY));
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <Wrapper>
      <IntroSection>
        <BannerLogoWrap>
          <BannerLogo src={logoBanner} alt={'logo'} />
        </BannerLogoWrap>
        <LedgerIntro $isShown={true}>
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
  padding: 20px;
`;

const BannerLogoWrap = styled.div``;

const BannerLogo = styled.img`
  width: 500px;
  border-radius: 20px;
  display: block;
  transform: translateX(-50px) translateY(-22px) rotate(-7deg);
  box-shadow: 5px 5px 10px #7d4e34;
`;

const LoginSection = styled(IntroSection)`
  width: 30%;
  border-radius: 20px;
`;

type LedgerIntroProps = {
  $isShown: boolean;
};

const LedgerIntro = styled.div<LedgerIntroProps>`
  position: absolute;
  width: calc(100% - 40px);
  bottom: 20px;
  padding: 20px;
  background-color: #f2f2f2;
  box-shadow: 5px 5px 5px #808080;
  /* border-radius: 20px; */
  border: 2px #e6e6e6 solid;
  overflow: hidden;
  height: 60%;
  display: flex;
  align-items: center;
  transition: opacity 1s ease, transform 1s ease;
  transform: ${({ $isShown }) =>
    $isShown ? 'translateX(0%)' : 'translateX(-100%)'};
  opacity: ${({ $isShown }) => ($isShown ? '1' : '0')};
`;

const IntroSwitches = styled.div``;

const DemoTitle = styled.p`
  position: absolute;
  bottom: 0;
`;
