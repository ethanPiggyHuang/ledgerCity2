import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { citySetting } from '../../../utils/gameSettings';

const landing = keyframes`
  0% {
    transform: translateY(-100px);
    opacity: 0;
    animation-timing-function: ease-in;
  }   
  30% {
    transform: translateY(-100px);
    opacity: 1;
    animation-timing-function: ease-in;
  } 
  80% {
    transform: translateY(-40px);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: translateY(0px);
    animation-timing-function: ease-out;
  }
`;

const Wrapper = styled.div`
  position: absolute;
  z-index: 2;
  animation: ${landing} 1s;
  &:hover {
    transform: translateY(-10px);
    cursor: grab;
  }
`;

const InteractiveGroup = styled.g`
  &:hover {
    transform: translateY(-5px);
  }
`;

export const HouseCityHall: React.FC = () => {
  const { scale } = useAppSelector((state) => state.cityArrangement);
  const { houseWidth } = citySetting;
  const widthNormalize = houseWidth / 199;
  // const dispatch = useAppDispatch();

  return (
    <Wrapper>
      <svg
        width={`${114 * 2.2 * widthNormalize * scale}px`}
        height={`${55 * 2.2 * widthNormalize * scale}px`}
        viewBox="0 0 114 55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Group">
          <path
            id="Vector"
            d="M69.5398 12.8799H43.7798V23.6099H69.5398V12.8799Z"
            fill="#DBA773"
          />
          <path
            id="Vector_2"
            d="M99.4199 23.6101H13.8999V28.2601H99.4199V23.6101Z"
            fill="#A7926F"
          />
          <path
            id="Vector_3"
            d="M88.0298 28.27H73.3198V50.65H88.0298V28.27Z"
            fill="#F2C190"
          />
          <path
            id="Vector_4"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M80.1202 50.6401H73.6602V42.3501C73.6602 40.5601 75.1302 39.0901 76.9202 39.0901C78.7102 39.0901 80.1802 40.5601 80.1802 42.3501V50.5801C80.1802 50.5801 80.1502 50.6401 80.1202 50.6401Z"
            fill="#815C4A"
          />
          <path
            id="Vector_5"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M86.2898 28.27H75.0698V28.6C75.0698 28.78 75.2198 28.93 75.3998 28.93H85.9698C86.1498 28.93 86.2998 28.78 86.2998 28.6V28.27H86.2898Z"
            fill="#DBA773"
          />
          <path
            id="Vector_6"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M88.2598 50.6401H81.7998V42.3501C81.7998 40.5601 83.2698 39.0901 85.0598 39.0901C86.8498 39.0901 88.3198 40.5601 88.3198 42.3501V50.5801C88.3198 50.5801 88.2898 50.6401 88.2598 50.6401Z"
            fill="#815C4A"
          />
          <path
            id="Vector_7"
            d="M110.49 28.27H88.04V50.65H110.49V28.27Z"
            fill="#815C4A"
          />
          <path
            id="Vector_8"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M85.52 27.14H113.31V26.54L99.42 20.54L85.52 26.54V27.14Z"
            fill="#F2C190"
          />
          <path
            id="Vector_9"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M86.71 26.5901H112.12L99.42 21.1001L86.71 26.5901Z"
            fill="#DBA773"
          />
          <path
            id="Vector_10"
            d="M112.54 27.1399H86.29V28.2699H112.54V27.1399Z"
            fill="#DBA773"
          />
          <path
            id="Vector_11"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M112.54 28.27H109.05V28.59C109.05 28.77 109.2 28.91 109.37 28.91H112.22C112.4 28.91 112.54 28.77 112.54 28.59V28.27Z"
            fill="#F2C190"
          />
          <path
            id="Vector_12"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M111.94 28.9099C111.98 35.3299 112.02 41.7599 112.06 48.1799H109.54C109.58 41.7599 109.62 35.3299 109.66 28.9099H111.93H111.94Z"
            fill="#DBA773"
          />
          <path
            id="Vector_13"
            d="M112.39 48.1799H109.2V50.6399H112.39V48.1799Z"
            fill="#F2C190"
          />
          <path
            id="Vector_14"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M93.6502 28.27H90.1602V28.59C90.1602 28.77 90.3002 28.91 90.4802 28.91H93.3302C93.5102 28.91 93.6502 28.77 93.6502 28.59V28.27Z"
            fill="#F2C190"
          />
          <path
            id="Vector_15"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M93.0401 28.9099C93.0801 35.3299 93.1201 41.7599 93.1601 48.1799H90.6401C90.6801 41.7599 90.7201 35.3299 90.7601 28.9099H93.0301H93.0401Z"
            fill="#DBA773"
          />
          <path
            id="Vector_16"
            d="M93.5001 48.1799H90.3101V50.6399H93.5001V48.1799Z"
            fill="#F2C190"
          />
          <path
            id="Vector_17"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M89.78 28.27H86.29V28.59C86.29 28.77 86.44 28.91 86.61 28.91H89.45C89.63 28.91 89.77 28.77 89.77 28.59V28.27H89.78Z"
            fill="#F2C190"
          />
          <path
            id="Vector_18"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M89.17 28.9099C89.21 35.3299 89.25 41.7599 89.29 48.1799H86.77C86.81 41.7599 86.85 35.3299 86.89 28.9099H89.16H89.17Z"
            fill="#DBA773"
          />
          <path
            id="Vector_19"
            d="M89.6299 48.1799H86.4399V50.6399H89.6299V48.1799Z"
            fill="#F2C190"
          />
          <path
            id="Vector_20"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M108.62 28.27H105.13V28.59C105.13 28.77 105.28 28.91 105.45 28.91H108.29C108.47 28.91 108.61 28.77 108.61 28.59V28.27H108.62Z"
            fill="#F2C190"
          />
          <path
            id="Vector_21"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M108.01 28.9099C108.05 35.3299 108.09 41.7599 108.13 48.1799H105.61C105.65 41.7599 105.69 35.3299 105.73 28.9099H108H108.01Z"
            fill="#DBA773"
          />
          <path
            id="Vector_22"
            d="M108.47 48.1799H105.28V50.6399H108.47V48.1799Z"
            fill="#F2C190"
          />
          <path
            id="Vector_23"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M96.9502 37.8499H101.57V31.9899C101.57 30.7199 100.53 29.6799 99.2602 29.6799C97.9902 29.6799 96.9502 30.7199 96.9502 31.9899V37.8499Z"
            fill="#DBA773"
          />
          <path
            id="Vector_24"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M97.4102 37.4599H101.12V32.0099C101.12 30.9899 100.29 30.1599 99.2701 30.1599C98.2501 30.1599 97.4202 30.9899 97.4202 32.0099V37.4599H97.4102Z"
            fill="#414764"
          />
          <path
            id="Vector_25"
            d="M101.35 31.8601H97.1699V32.1601H101.35V31.8601Z"
            fill="#DBA773"
          />
          <path
            id="Vector_26"
            d="M99.4001 32.0601H99.1201V37.4601H99.4001V32.0601Z"
            fill="#DBA773"
          />
          <path
            id="Vector_27"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M96.9502 48.92H101.57V43.06C101.57 41.79 100.53 40.75 99.2602 40.75C97.9902 40.75 96.9502 41.79 96.9502 43.06V48.92Z"
            fill="#DBA773"
          />
          <path
            id="Vector_28"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M97.4102 48.52H101.12V43.07C101.12 42.05 100.29 41.22 99.2701 41.22C98.2501 41.22 97.4202 42.05 97.4202 43.07V48.52H97.4102Z"
            fill="#414764"
          />
          <path
            id="Vector_29"
            d="M101.35 42.9299H97.1699V43.2299H101.35V42.9299Z"
            fill="#DBA773"
          />
          <path
            id="Vector_30"
            d="M99.4001 43.1201H99.1201V48.5201H99.4001V43.1201Z"
            fill="#DBA773"
          />
          <path
            id="Vector_31"
            d="M39.9898 28.27H25.2798V50.65H39.9898V28.27Z"
            fill="#F2C190"
          />
          <path
            id="Vector_32"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M33.2001 50.6401H39.6601V42.3501C39.6601 40.5601 38.1901 39.0901 36.4001 39.0901C34.6101 39.0901 33.1401 40.5601 33.1401 42.3501V50.5801C33.1401 50.5801 33.1701 50.6401 33.2001 50.6401Z"
            fill="#815C4A"
          />
          <path
            id="Vector_33"
            d="M73.4902 28.27H39.9902V50.65H73.4902V28.27Z"
            fill="#815C4A"
          />
          <path
            id="Vector_34"
            d="M75.07 26.6899H38.25V28.2699H75.07V26.6899Z"
            fill="#DBA773"
          />
          <path
            id="Vector_35"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M38.25 28.27H41.74V28.59C41.74 28.77 41.6 28.91 41.42 28.91H38.57C38.39 28.91 38.25 28.77 38.25 28.59V28.27Z"
            fill="#F2C190"
          />
          <path
            id="Vector_36"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M38.8602 28.9099C38.8202 35.3299 38.7802 41.7599 38.7402 48.1799H41.2602C41.2202 41.7599 41.1802 35.3299 41.1402 28.9099H38.8702H38.8602Z"
            fill="#DBA773"
          />
          <path
            id="Vector_37"
            d="M41.5899 48.1799H38.3999V50.6399H41.5899V48.1799Z"
            fill="#F2C190"
          />
          <path
            id="Vector_38"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M71.5801 28.27H75.0701V28.59C75.0701 28.77 74.9201 28.91 74.7501 28.91H71.9001C71.7201 28.91 71.5801 28.77 71.5801 28.59V28.27Z"
            fill="#F2C190"
          />
          <path
            id="Vector_39"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M72.1898 28.9099C72.1498 35.3299 72.1098 41.7599 72.0698 48.1799H74.5898C74.5498 41.7599 74.5098 35.3299 74.4698 28.9099H72.1998H72.1898Z"
            fill="#DBA773"
          />
          <path
            id="Vector_40"
            d="M74.92 48.1799H71.73V50.6399H74.92V48.1799Z"
            fill="#F2C190"
          />
          <path
            id="Vector_41"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M60.6299 28.27H64.1199V28.59C64.1199 28.77 63.9799 28.91 63.7999 28.91H60.9499C60.7699 28.91 60.6299 28.77 60.6299 28.59V28.27Z"
            fill="#F2C190"
          />
          <path
            id="Vector_42"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M61.2401 28.9099C61.2001 35.3299 61.1601 41.7599 61.1201 48.1799H63.6401C63.6001 41.7599 63.5601 35.3299 63.5201 28.9099H61.2501H61.2401Z"
            fill="#DBA773"
          />
          <path
            id="Vector_43"
            d="M63.9598 48.1799H60.7798V50.6399H63.9598V48.1799Z"
            fill="#F2C190"
          />
          <path
            id="Vector_44"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M49.3501 28.27H52.8401V28.59C52.8401 28.77 52.6901 28.91 52.5201 28.91H49.6701C49.4901 28.91 49.3501 28.77 49.3501 28.59V28.27Z"
            fill="#F2C190"
          />
          <path
            id="Vector_45"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M49.9598 28.9099C49.9198 35.3299 49.8798 41.7599 49.8398 48.1799H52.3598C52.3198 41.7599 52.2798 35.3299 52.2398 28.9099H49.9698H49.9598Z"
            fill="#DBA773"
          />
          <path
            id="Vector_46"
            d="M52.6998 48.1799H49.5098V50.6399H52.6998V48.1799Z"
            fill="#F2C190"
          />
          <path
            id="Vector_47"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M42.3998 50.6401H48.8598V42.3501C48.8598 40.5601 47.3898 39.0901 45.5998 39.0901C43.8098 39.0901 42.3398 40.5601 42.3398 42.3501V50.5801C42.3398 50.5801 42.3698 50.6401 42.3998 50.6401Z"
            fill="#66442E"
          />
          <path
            id="Vector_48"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M53.5698 50.6401H60.0298V42.3501C60.0298 40.5601 58.5598 39.0901 56.7698 39.0901C54.9798 39.0901 53.5098 40.5601 53.5098 42.3501V50.5801C53.5098 50.5801 53.5398 50.6401 53.5698 50.6401Z"
            fill="#66442E"
          />
          <path
            id="Vector_49"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M64.6401 50.6401H71.1001V42.3501C71.1001 40.5601 69.6301 39.0901 67.8401 39.0901C66.0501 39.0901 64.5801 40.5601 64.5801 42.3501V50.5801C64.5801 50.5801 64.6101 50.6401 64.6401 50.6401Z"
            fill="#66442E"
          />
          <path
            id="Vector_50"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M70.1498 38.19H65.5298V32.33C65.5298 31.06 66.5698 30.02 67.8398 30.02C69.1098 30.02 70.1498 31.06 70.1498 32.33V38.19Z"
            fill="#DBA773"
          />
          <path
            id="Vector_51"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M69.69 37.8H65.98V32.35C65.98 31.33 66.81 30.5 67.83 30.5C68.85 30.5 69.68 31.33 69.68 32.35V37.8H69.69Z"
            fill="#414764"
          />
          <path
            id="Vector_52"
            d="M69.93 32.2H65.75V32.5H69.93V32.2Z"
            fill="#DBA773"
          />
          <path
            id="Vector_53"
            d="M67.9799 32.3999H67.6899V37.7999H67.9799V32.3999Z"
            fill="#DBA773"
          />
          <path
            id="Vector_54"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M47.9198 38.19H43.2998V32.33C43.2998 31.06 44.3398 30.02 45.6098 30.02C46.8798 30.02 47.9198 31.06 47.9198 32.33V38.19Z"
            fill="#DBA773"
          />
          <path
            id="Vector_55"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M47.46 37.8H43.75V32.35C43.75 31.33 44.58 30.5 45.6 30.5C46.62 30.5 47.45 31.33 47.45 32.35V37.8H47.46Z"
            fill="#414764"
          />
          <path
            id="Vector_56"
            d="M47.6898 32.2H43.5098V32.5H47.6898V32.2Z"
            fill="#DBA773"
          />
          <path
            id="Vector_57"
            d="M45.74 32.3999H45.46V37.7999H45.74V32.3999Z"
            fill="#DBA773"
          />
          <path
            id="Vector_58"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M59.0302 38.19H54.4102V32.33C54.4102 31.06 55.4502 30.02 56.7202 30.02C57.9902 30.02 59.0302 31.06 59.0302 32.33V38.19Z"
            fill="#DBA773"
          />
          <path
            id="Vector_59"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M58.5699 37.8H54.8599V32.35C54.8599 31.33 55.6899 30.5 56.7099 30.5C57.7299 30.5 58.5599 31.33 58.5599 32.35V37.8H58.5699Z"
            fill="#414764"
          />
          <path
            id="Vector_60"
            d="M58.8099 32.2H54.6299V32.5H58.8099V32.2Z"
            fill="#DBA773"
          />
          <path
            id="Vector_61"
            d="M56.8701 32.3999H56.5801V37.7999H56.8701V32.3999Z"
            fill="#DBA773"
          />
          <path
            id="Vector_62"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M27.0198 28.27H38.2398V28.6C38.2398 28.78 38.0898 28.93 37.9098 28.93H27.3398C27.1598 28.93 27.0098 28.78 27.0098 28.6V28.27H27.0198Z"
            fill="#DBA773"
          />
          <path
            id="Vector_63"
            d="M113.29 50.6399H0.310059V54.3099H113.29V50.6399Z"
            fill="#DBA773"
          />
          <path
            id="Vector_64"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M25.06 50.6401H31.52V42.3501C31.52 40.5601 30.05 39.0901 28.26 39.0901C26.47 39.0901 25 40.5601 25 42.3501V50.5801C25 50.5801 25.03 50.6401 25.06 50.6401Z"
            fill="#815C4A"
          />
          <path
            id="Vector_65"
            d="M25.2801 28.27H2.83008V50.65H25.2801V28.27Z"
            fill="#815C4A"
          />
          <path
            id="Vector_66"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M27.8 27.14H0V26.54L13.9 20.54L27.8 26.54V27.14Z"
            fill="#F2C190"
          />
          <path
            id="Vector_67"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M26.6099 26.5901H1.18994L13.8999 21.1001L26.6099 26.5901Z"
            fill="#DBA773"
          />
          <path
            id="Vector_68"
            d="M27.02 27.1399H0.77002V28.2699H27.02V27.1399Z"
            fill="#DBA773"
          />
          <path
            id="Vector_69"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.77002 28.27H4.26002V28.59C4.26002 28.77 4.12002 28.91 3.94002 28.91H1.09002C0.91002 28.91 0.77002 28.77 0.77002 28.59V28.27Z"
            fill="#F2C190"
          />
          <path
            id="Vector_70"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.37977 28.9099C1.33977 35.3299 1.29977 41.7599 1.25977 48.1799H3.77977C3.73977 41.7599 3.69977 35.3299 3.65977 28.9099H1.37977Z"
            fill="#DBA773"
          />
          <path
            id="Vector_71"
            d="M4.10992 48.1799H0.919922V50.6399H4.10992V48.1799Z"
            fill="#F2C190"
          />
          <path
            id="Vector_72"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.6602 28.27H23.1502V28.59C23.1502 28.77 23.0002 28.91 22.8302 28.91H19.9802C19.8002 28.91 19.6602 28.77 19.6602 28.59V28.27Z"
            fill="#F2C190"
          />
          <path
            id="Vector_73"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.2699 28.9099C20.2299 35.3299 20.1899 41.7599 20.1499 48.1799H22.6699C22.6299 41.7599 22.5899 35.3299 22.5499 28.9099H20.2799H20.2699Z"
            fill="#DBA773"
          />
          <path
            id="Vector_74"
            d="M23.0098 48.1799H19.8198V50.6399H23.0098V48.1799Z"
            fill="#F2C190"
          />
          <path
            id="Vector_75"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M23.5298 28.27H27.0198V28.59C27.0198 28.77 26.8798 28.91 26.6998 28.91H23.8498C23.6698 28.91 23.5298 28.77 23.5298 28.59V28.27Z"
            fill="#F2C190"
          />
          <path
            id="Vector_76"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24.14 28.9099C24.1 35.3299 24.06 41.7599 24.02 48.1799H26.54C26.5 41.7599 26.46 35.3299 26.42 28.9099H24.15H24.14Z"
            fill="#DBA773"
          />
          <path
            id="Vector_77"
            d="M26.8799 48.1799H23.6899V50.6399H26.8799V48.1799Z"
            fill="#F2C190"
          />
          <path
            id="Vector_78"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.68994 28.27H8.17994V28.59C8.17994 28.77 8.02994 28.91 7.85994 28.91H5.01994C4.83994 28.91 4.69994 28.77 4.69994 28.59V28.27H4.68994Z"
            fill="#F2C190"
          />
          <path
            id="Vector_79"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.30018 28.9099C5.26018 35.3299 5.22018 41.7599 5.18018 48.1799H7.70018C7.66018 41.7599 7.62018 35.3299 7.58018 28.9099H5.31018H5.30018Z"
            fill="#DBA773"
          />
          <path
            id="Vector_80"
            d="M8.02984 48.1799H4.83984V50.6399H8.02984V48.1799Z"
            fill="#F2C190"
          />
          <path
            id="Vector_81"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.37 37.8499H11.75V31.9899C11.75 30.7199 12.79 29.6799 14.06 29.6799C15.33 29.6799 16.37 30.7199 16.37 31.9899V37.8499Z"
            fill="#DBA773"
          />
          <path
            id="Vector_82"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.9102 37.4599H12.2002V32.0099C12.2002 30.9899 13.0302 30.1599 14.0502 30.1599C15.0702 30.1599 15.9002 30.9899 15.9002 32.0099V37.4599H15.9102Z"
            fill="#414764"
          />
          <path
            id="Vector_83"
            d="M16.14 31.8601H11.96V32.1601H16.14V31.8601Z"
            fill="#DBA773"
          />
          <path
            id="Vector_84"
            d="M14.2002 32.0601H13.9102V37.4601H14.2002V32.0601Z"
            fill="#DBA773"
          />
          <path
            id="Vector_85"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.37 48.92H11.75V43.06C11.75 41.79 12.79 40.75 14.06 40.75C15.33 40.75 16.37 41.79 16.37 43.06V48.92Z"
            fill="#DBA773"
          />
          <path
            id="Vector_86"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.9102 48.52H12.2002V43.07C12.2002 42.05 13.0302 41.22 14.0502 41.22C15.0702 41.22 15.9002 42.05 15.9002 43.07V48.52H15.9102Z"
            fill="#414764"
          />
          <path
            id="Vector_87"
            d="M16.14 42.9299H11.96V43.2299H16.14V42.9299Z"
            fill="#DBA773"
          />
          <path
            id="Vector_88"
            d="M14.2002 43.1201H13.9102V48.5201H14.2002V43.1201Z"
            fill="#DBA773"
          />
          <path
            id="Vector_89"
            d="M113.29 51.3401H0.310059V52.0501H113.29V51.3401Z"
            fill="#F2C190"
          />
          <path
            id="Vector_90"
            d="M113.29 52.54H0.310059V53.25H113.29V52.54Z"
            fill="#F2C190"
          />
          <path
            id="Vector_91"
            d="M113.34 53.6001H0.359863V54.3101H113.34V53.6001Z"
            fill="#F2C190"
          />
          <path
            id="Vector_92"
            d="M70.28 12.8799H43.04V14.1499H70.28V12.8799Z"
            fill="#815C4A"
          />
          <path
            id="Vector_93"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M47.7802 18.5199H45.4702V15.5899C45.4702 14.9499 45.9902 14.4299 46.6302 14.4299C47.2702 14.4299 47.7902 14.9499 47.7902 15.5899V18.5199H47.7802Z"
            fill="#F2C190"
          />
          <path
            id="Vector_94"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M47.5502 18.3299H45.7002V15.5999C45.7002 15.0899 46.1202 14.6699 46.6302 14.6699C47.1402 14.6699 47.5602 15.0899 47.5602 15.5999V18.3299H47.5502Z"
            fill="#414764"
          />
          <path
            id="Vector_95"
            d="M47.6701 15.53H45.5801V15.68H47.6701V15.53Z"
            fill="#F2C190"
          />
          <path
            id="Vector_96"
            d="M46.6898 15.6299H46.5498V18.3299H46.6898V15.6299Z"
            fill="#F2C190"
          />
          <path
            id="Vector_97"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M50.6298 18.5199H48.3198V15.5899C48.3198 14.9499 48.8398 14.4299 49.4798 14.4299C50.1198 14.4299 50.6398 14.9499 50.6398 15.5899V18.5199H50.6298Z"
            fill="#F2C190"
          />
          <path
            id="Vector_98"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M50.3998 18.3299H48.5498V15.5999C48.5498 15.0899 48.9698 14.6699 49.4798 14.6699C49.9898 14.6699 50.4098 15.0899 50.4098 15.5999V18.3299H50.3998Z"
            fill="#414764"
          />
          <path
            id="Vector_99"
            d="M50.5099 15.53H48.4199V15.68H50.5099V15.53Z"
            fill="#F2C190"
          />
          <path
            id="Vector_100"
            d="M49.5399 15.6299H49.3999V18.3299H49.5399V15.6299Z"
            fill="#F2C190"
          />
          <path
            id="Vector_101"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M53.4999 18.5199H51.1899V15.5899C51.1899 14.9499 51.7099 14.4299 52.3499 14.4299C52.9899 14.4299 53.5099 14.9499 53.5099 15.5899V18.5199H53.4999Z"
            fill="#F2C190"
          />
          <path
            id="Vector_102"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M53.2699 18.3299H51.4199V15.5999C51.4199 15.0899 51.8399 14.6699 52.3499 14.6699C52.8599 14.6699 53.2799 15.0899 53.2799 15.5999V18.3299H53.2699Z"
            fill="#414764"
          />
          <path
            id="Vector_103"
            d="M53.3898 15.53H51.2998V15.68H53.3898V15.53Z"
            fill="#F2C190"
          />
          <path
            id="Vector_104"
            d="M52.41 15.6299H52.27V18.3299H52.41V15.6299Z"
            fill="#F2C190"
          />
          <path
            id="Vector_105"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M56.35 18.5199H54.04V15.5899C54.04 14.9499 54.56 14.4299 55.2 14.4299C55.84 14.4299 56.36 14.9499 56.36 15.5899V18.5199H56.35Z"
            fill="#F2C190"
          />
          <path
            id="Vector_106"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M56.12 18.3299H54.27V15.5999C54.27 15.0899 54.69 14.6699 55.2 14.6699C55.71 14.6699 56.13 15.0899 56.13 15.5999V18.3299H56.12Z"
            fill="#414764"
          />
          <path
            id="Vector_107"
            d="M56.2399 15.53H54.1499V15.68H56.2399V15.53Z"
            fill="#F2C190"
          />
          <path
            id="Vector_108"
            d="M55.2601 15.6299H55.1201V18.3299H55.2601V15.6299Z"
            fill="#F2C190"
          />
          <path
            id="Vector_109"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M59.29 18.5199H56.98V15.5899C56.98 14.9499 57.5 14.4299 58.14 14.4299C58.78 14.4299 59.3 14.9499 59.3 15.5899V18.5199H59.29Z"
            fill="#F2C190"
          />
          <path
            id="Vector_110"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M59.06 18.3299H57.21V15.5999C57.21 15.0899 57.63 14.6699 58.14 14.6699C58.65 14.6699 59.07 15.0899 59.07 15.5999V18.3299H59.06Z"
            fill="#414764"
          />
          <path
            id="Vector_111"
            d="M59.1798 15.53H57.0898V15.68H59.1798V15.53Z"
            fill="#F2C190"
          />
          <path
            id="Vector_112"
            d="M58.2001 15.6299H58.0601V18.3299H58.2001V15.6299Z"
            fill="#F2C190"
          />
          <path
            id="Vector_113"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M62.1298 18.5199H59.8198V15.5899C59.8198 14.9499 60.3398 14.4299 60.9798 14.4299C61.6198 14.4299 62.1398 14.9499 62.1398 15.5899V18.5199H62.1298Z"
            fill="#F2C190"
          />
          <path
            id="Vector_114"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M61.8998 18.3299H60.0498V15.5999C60.0498 15.0899 60.4698 14.6699 60.9798 14.6699C61.4898 14.6699 61.9098 15.0899 61.9098 15.5999V18.3299H61.8998Z"
            fill="#414764"
          />
          <path
            id="Vector_115"
            d="M62.0202 15.53H59.9302V15.68H62.0202V15.53Z"
            fill="#F2C190"
          />
          <path
            id="Vector_116"
            d="M61.0399 15.6299H60.8999V18.3299H61.0399V15.6299Z"
            fill="#F2C190"
          />
          <path
            id="Vector_117"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M64.9799 18.5199H62.6699V15.5899C62.6699 14.9499 63.1899 14.4299 63.8299 14.4299C64.4699 14.4299 64.9899 14.9499 64.9899 15.5899V18.5199H64.9799Z"
            fill="#F2C190"
          />
          <path
            id="Vector_118"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M64.7401 18.3299H62.8901V15.5999C62.8901 15.0899 63.3101 14.6699 63.8201 14.6699C64.3301 14.6699 64.7501 15.0899 64.7501 15.5999V18.3299H64.7401Z"
            fill="#414764"
          />
          <path
            id="Vector_119"
            d="M64.86 15.53H62.77V15.68H64.86V15.53Z"
            fill="#F2C190"
          />
          <path
            id="Vector_120"
            d="M63.89 15.6299H63.75V18.3299H63.89V15.6299Z"
            fill="#F2C190"
          />
          <path
            id="Vector_121"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M67.8198 18.5199H65.5098V15.5899C65.5098 14.9499 66.0298 14.4299 66.6698 14.4299C67.3098 14.4299 67.8298 14.9499 67.8298 15.5899V18.5199H67.8198Z"
            fill="#F2C190"
          />
          <path
            id="Vector_122"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M67.5902 18.3299H65.7402V15.5999C65.7402 15.0899 66.1602 14.6699 66.6702 14.6699C67.1802 14.6699 67.6002 15.0899 67.6002 15.5999V18.3299H67.5902Z"
            fill="#414764"
          />
          <path
            id="Vector_123"
            d="M67.7101 15.53H65.6201V15.68H67.7101V15.53Z"
            fill="#F2C190"
          />
          <path
            id="Vector_124"
            d="M66.7299 15.6299H66.5898V18.3299H66.7299V15.6299Z"
            fill="#F2C190"
          />
          <path
            id="Vector_125"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M76.1499 26.6899H37.1699V25.8499L56.6599 17.4299L76.1499 25.8499V26.6899Z"
            fill="#F2C190"
          />
          <path
            id="Vector_126"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M74.4798 25.91H38.8398L56.6598 18.21L74.4798 25.91Z"
            fill="#DBA773"
          />
          <path
            id="Vector_127"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M44.93 18.5199H43.77V14.4399C44.41 14.4399 44.93 14.9599 44.93 15.5999V18.5299V18.5199Z"
            fill="#F2C190"
          />
          <path
            id="Vector_128"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M44.7 18.3299H43.77V14.6799C44.28 14.6799 44.7 15.0999 44.7 15.6099V18.3399V18.3299Z"
            fill="#414764"
          />
          <path
            id="Vector_129"
            d="M44.8198 15.53H43.7798V15.68H44.8198V15.53Z"
            fill="#F2C190"
          />
          <path
            id="Vector_130"
            d="M43.8498 15.6299H43.7798V18.3299H43.8498V15.6299Z"
            fill="#F2C190"
          />
          <path
            id="Vector_131"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M68.4702 18.5199H69.5402V14.4399C68.9502 14.4399 68.4702 14.9599 68.4702 15.5999V18.5299V18.5199Z"
            fill="#F2C190"
          />
          <path
            id="Vector_132"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M68.6802 18.3299H69.5402V14.6799C69.0702 14.6799 68.6802 15.0999 68.6802 15.6099V18.3399V18.3299Z"
            fill="#414764"
          />
          <path
            id="Vector_133"
            d="M69.5398 15.53H68.5698V15.68H69.5398V15.53Z"
            fill="#F2C190"
          />
          <path
            id="Vector_134"
            d="M69.5402 15.6299H69.4702V18.3299H69.5402V15.6299Z"
            fill="#F2C190"
          />
          <path
            id="Vector_135"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M56.6598 12.88H69.5398C69.5398 5.76 63.7698 0 56.6598 0C49.5498 0 43.7798 5.77 43.7798 12.88C43.7798 12.99 43.7798 13.1 43.7798 13.21L56.6598 12.88Z"
            fill="#414764"
          />
        </g>
      </svg>
    </Wrapper>
  );
};
