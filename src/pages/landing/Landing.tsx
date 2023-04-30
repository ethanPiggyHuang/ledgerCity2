import React, { useEffect, WheelEvent } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import logoBanner from '../../assets/logoBanner.png';
import { LoginPanel } from './LoginPanel';
import { Ledger } from '../ledger/Ledger';
import { LabelDemo } from './LabelDemo';
import { LANDING_SCROLL_Y } from '../../redux/reducers/pageControlSlice';

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

  // const LedgerDemoAttrs = (
  //   scrollY: number,
  //   breakpoint: number
  // ): { leftAttrs: string; opacityAttrs: string } => {
  //   const buffer = 300;
  //   const pace = 0.2;
  //   const convertedY = scrollY * pace;
  //   let left: number;
  //   let opacity: number;
  //   if (convertedY <= breakpoint / 2) {
  //     left = convertedY;
  //     opacity = convertedY / 300;
  //   } else if (convertedY <= breakpoint) {
  //     left = convertedY;
  //     opacity = 1;
  //   } else if (convertedY <= breakpoint + buffer) {
  //     left = breakpoint;
  //     opacity = 1;
  //   } else {
  //     left = breakpoint * 2 + buffer - convertedY;
  //     opacity = 1;
  //   }

  //   return { leftAttrs: `${left}px`, opacityAttrs: `${opacity}` };
  // };

  return (
    <Wrapper>
      <IntroSection>
        <BannerLogoWrap>
          <BannerLogo src={logoBanner} alt={'logo'} />
        </BannerLogoWrap>
        <LedgerDemo
          $isShown={false}
          // $leftAttrs={`${LedgerDemoAttrs(landingScrollY, 400).leftAttrs}`}
          // $opacityAttrs={`${LedgerDemoAttrs(landingScrollY, 400).opacityAttrs}`}
        >
          <LabelDemo />
        </LedgerDemo>
        <DemoTitle>{landingScrollY}</DemoTitle>
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
  padding: 70px 100px;
  display: flex;
  gap: 5%;
`;

const IntroSection = styled.div`
  border: 6px #f2f2f2 solid;
  background-color: rgba(242, 242, 242, 0.7);
  height: calc(100vh - 140px);
  width: 65%;
  border-radius: 80px 20px 20px 20px;
  position: relative;
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

type LedgerDemoProps = {
  $isShown: boolean;
};

const LedgerDemo = styled.div<LedgerDemoProps>`
  position: absolute;
  width: 40%;
  background-color: #f2f2f2;
  border-radius: 10px;
  border: 3px #808080 solid;
  overflow: hidden;
  height: 50%;
  /* display: none; */
  transition: opacity 1s ease;
  opacity: ${({ $isShown }) => ($isShown ? '1' : '0')};
`;

const DemoTitle = styled.p`
  position: absolute;
  bottom: 0;
`;
