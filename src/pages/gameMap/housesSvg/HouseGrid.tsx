import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import {
  gridLength,
  mainLabels,
  labelColorCodes,
} from '../../../utils/gameSettings';

const Wrapper = styled.div`
  position: absolute;
  z-index: 0;
  // display: none;
  top: 0;
  // &:hover {
  //   transform: translateY(-10px);
  // }
`;

const translate = keyframes`
from {
  transform: rotate(0deg) translateX(0) translateY(0);
}
to {
  transform: rotate(10deg) translateX(10px) translateY(-20px);
}
`;

const InteractiveGroup = styled.g`
  &:hover {
    animation: ${translate} 0.7s linear infinite alternate;
  }
`;

export const HouseGrid: React.FC<{ houseType: string }> = ({ houseType }) => {
  const { scale } = useAppSelector((state) => state.cityArrangement);
  const widthNormalize = gridLength / 160;
  // const dispatch = useAppDispatch();

  const labelIndex = mainLabels.findIndex((label) => label === houseType);
  const floorColor = labelColorCodes[labelIndex] || '#9DA6A5';

  return (
    <Wrapper>
      <svg
        width={`${160 * widthNormalize * scale}px`}
        height={`${245 * widthNormalize * scale}px`}
        viewBox="0 0 160 245"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Group 57">
          <rect id="Rectangle 45" width="160" height="245" fill="#D9D9D9" />
          <g
            id="_&#229;&#156;&#150;&#229;&#177;&#164;_1"
            clip-path="url(#clip0_41_9392)"
          ></g>
          <g id="Group 52">
            <g id="Group 37">
              <rect id="Rectangle 19" width="160" height="160" fill="#D6E0DB" />
              <rect
                id="Rectangle 20"
                y="160"
                width="160"
                height="11.25"
                fill="#AEBFC6"
              />
              <g id="Group 34">
                <rect
                  id="Rectangle 21"
                  y="170.93"
                  width="159.535"
                  height="62.6744"
                  fill="#AC9C89"
                />
                <g id="Intersect" filter="url(#filter0_f_41_9392)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1.89923 195.62V188.023H1.89935V195.62H1.89923ZM1.89923 222.209V203.217H1.89935V222.209H1.89923ZM1.89935 226.008H157.636L157.636 222.209H98.5337C93.2891 222.209 89.0375 217.958 89.0375 212.713C89.0375 207.469 93.2891 203.217 98.5337 203.217H157.636V195.62H102.106C100.008 195.62 98.3077 193.92 98.3077 191.822C98.3077 189.724 100.008 188.023 102.106 188.023H157.636V180.426H1.89935V188.023H85.2392C87.337 188.023 89.0376 189.724 89.0376 191.822C89.0376 193.92 87.337 195.62 85.2392 195.62H1.89935V203.217H49.8772C55.1218 203.217 59.3733 207.469 59.3733 212.713C59.3733 217.958 55.1218 222.209 49.8772 222.209H1.89935V226.008Z"
                    fill="#B4AA99"
                  />
                </g>
                <rect
                  id="Rectangle 22"
                  y="233.605"
                  width="159.535"
                  height="11.3954"
                  fill="#A19382"
                />
              </g>
              <rect
                id="Rectangle 28"
                x="15.25"
                y="14"
                width="130.75"
                height="130.75"
                rx="3.5"
                stroke="#E2E9E6"
                stroke-width="3"
                stroke-dasharray="8 8"
              />
            </g>
            <rect
              id="Rectangle 36"
              x="26.5"
              y="25.5"
              width="108"
              height="108"
              rx="2.5"
              fill={floorColor}
              fill-opacity="0.5"
              stroke="#FAFBFB"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_41_9392"
            x="0.899231"
            y="179.426"
            width="157.737"
            height="47.5814"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="0.5"
              result="effect1_foregroundBlur_41_9392"
            />
          </filter>
          <clipPath id="clip0_41_9392">
            <rect
              width="98.57"
              height="144.94"
              fill="white"
              transform="translate(31 50)"
            />
          </clipPath>
        </defs>
      </svg>
    </Wrapper>
  );
};