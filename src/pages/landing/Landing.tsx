import React from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import logoBanner from '../../assets/logoBanner.png';
import { LoginPanel } from './LoginPanel';

export const Landing: React.FC = () => {
  const { userId } = useAppSelector((state) => state.userInfo.data);

  const dispatch = useAppDispatch();

  return (
    <Wrapper>
      <IntroSection>
        <BannerLogoWrap>
          <BannerLogo src={logoBanner} alt={'logo'} />
        </BannerLogoWrap>
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
  position: relative;
  background: linear-gradient(#c8e2cc, #98d5da);
  overflow: hidden;
  padding: 70px 100px;
  display: flex;
  gap: 5%;
`;

const IntroSection = styled.div`
  border: 6px #f2f2f2 solid;
  background-color: rgba(242, 242, 242, 0.7);
  height: 100%;
  width: 65%;
  border-radius: 80px 20px 20px 20px;
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
