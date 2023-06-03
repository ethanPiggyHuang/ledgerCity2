import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faUtensils,
  faMugHot,
  faTrainSubway,
  faShirt,
  faGamepad,
  faHouse,
  faMobileScreenButton,
  faBriefcaseMedical,
  faGift,
  faTags,
} from '@fortawesome/free-solid-svg-icons';
import { HouseOfFood } from '../features/City/housesSvg/HouseOfFood';
import { HouseOfClothes } from '../features/City/housesSvg/HouseOfClothes';
import { HouseOfDrinks } from '../features/City/housesSvg/HouseOfDrinks';
import { HouseOfPlants } from '../features/City/housesSvg/HouseOfPlants';

export const labelIndex: {
  [key: string]: number;
} = {
  食物: 0,
  飲品: 1,
  交通: 2,
  衣裝: 3,
  娛樂: 4,
  居家: 5,
  '3C': 6,
  醫藥: 7,
  人際: 8,
  其他: 9,
};

export const mainLabels: {
  name: string;
  colorCode: string;
  icon: IconDefinition;
  subLabels: string[];
  houseComponent: React.FC<{}>;
}[] = [
  {
    name: '食物',
    colorCode: '#F09492',
    icon: faUtensils,
    subLabels: ['早餐', '午餐', '晚餐'],
    houseComponent: HouseOfFood,
  },
  {
    name: '飲品',
    colorCode: '#94C0B8',
    icon: faMugHot,
    subLabels: ['手搖杯', '咖啡', '水'],
    houseComponent: HouseOfDrinks,
  },
  {
    name: '交通',
    colorCode: '#78C1FA',
    icon: faTrainSubway,
    subLabels: ['通勤', '火車', '高鐵'],
    houseComponent: HouseOfPlants,
  },
  {
    name: '衣裝',
    colorCode: '#E6C352',
    icon: faShirt,
    subLabels: ['上衣', '褲/裙', '貼身衣物', '配件'],
    houseComponent: HouseOfClothes,
  },
  {
    name: '娛樂',
    colorCode: '#FFB071',
    icon: faGamepad,
    subLabels: ['電影', 'KTV', '展覽'],
    houseComponent: HouseOfPlants,
  },
  {
    name: '居家',
    colorCode: '#B6C64A',
    icon: faHouse,
    subLabels: ['房租', '房貸', '水費', '電費'],
    houseComponent: HouseOfPlants,
  },
  {
    name: '3C',
    colorCode: '#5F5DB7',
    icon: faMobileScreenButton,
    subLabels: ['網路費', '手機', '電腦'],
    houseComponent: HouseOfPlants,
  },
  {
    name: '醫藥',
    colorCode: '#FF6868',
    icon: faBriefcaseMedical,
    subLabels: ['掛號', '保健食品', '牙醫'],
    houseComponent: HouseOfPlants,
  },
  {
    name: '人際',
    colorCode: '#9896EB',
    icon: faGift,
    subLabels: ['伴侶', '親人', '朋友', '職場'],
    houseComponent: HouseOfPlants,
  },
  {
    name: '其他',
    colorCode: '#9DA6A5',
    icon: faTags,
    subLabels: ['繳稅'],
    houseComponent: HouseOfPlants,
  },
];

export const citySetting = {
  gridLength: 160,
  houseLength: 120,
  cityPadding: {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  },
  mayorSize: {
    width: 26,
    height: 30,
  },
};

export const gridColor: { [key: string]: 'lightgreen' | 'lightcarol' | '' } = {
  available: 'lightgreen',
  forbidden: 'lightcarol',
  none: '',
};
