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

export const mainLabel: {
  name: string;
  colorCode: string;
  icon: IconDefinition;
  subLabels: string[];
}[] = [
  {
    name: '食物',
    colorCode: '#F09492',
    icon: faUtensils,
    subLabels: ['早餐', '午餐', '晚餐'],
  },
  {
    name: '飲品',
    colorCode: '#94C0B8',
    icon: faMugHot,
    subLabels: ['手搖杯', '咖啡', '水'],
  },
  {
    name: '交通',
    colorCode: '#78C1FA',
    icon: faTrainSubway,
    subLabels: ['通勤', '火車', '高鐵'],
  },
  {
    name: '衣裝',
    colorCode: '#E6C352',
    icon: faShirt,
    subLabels: ['上衣', '褲/裙', '貼身衣物', '配件'],
  },
  {
    name: '娛樂',
    colorCode: '#E8BB71',
    icon: faGamepad,
    subLabels: ['電影', 'KTV', '展覽'],
  },
  {
    name: '居家',
    colorCode: '#B6C64A',
    icon: faHouse,
    subLabels: ['房租', '房貸', '水費', '電費'],
  },
  {
    name: '3C',
    colorCode: '#5F5DB7',
    icon: faMobileScreenButton,
    subLabels: ['網路費', '手機', '電腦'],
  },
  {
    name: '醫藥',
    colorCode: '#FF6868',
    icon: faBriefcaseMedical,
    subLabels: ['掛號', '保健食品', '牙醫'],
  },
  {
    name: '人際',
    colorCode: '#9896EB',
    icon: faGift,
    subLabels: ['伴侶', '親人', '朋友', '職場'],
  },
  {
    name: '其他',
    colorCode: '#9DA6A5',
    icon: faTags,
    subLabels: ['繳稅'],
  },
];

export const mainLabels: string[] = [
  '食物',
  '飲品',
  '交通',
  '衣裝',
  '娛樂',
  '居家',
  '3C',
  '醫藥',
  '人際',
  '其他',
];

export const labelColorCodes: string[] = [
  '#F09492',
  '#94C0B8',
  '#78C1FA',
  '#E6C352',
  '#E8BB71',
  '#B6C64A',
  '#5F5DB7',
  '#FF6868',
  '#9896EB',
  '#9DA6A5',
];

export const labelIcons = [
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
];

export const subLabels: { [key: string]: string[] } = {
  食物: ['# 早餐', '# 午餐', '# 晚餐'],
  飲品: ['手搖杯', '咖啡', '水'],
  交通: ['通勤', '火車', '高鐵'],
  衣裝: ['上衣', '褲/裙', '貼身衣物', '配件'],
  娛樂: ['電影', 'KTV', '展覽'],
  居家: ['房租', '房貸', '水費', '電費'],
  '3C': ['網路費', '手機', '電腦'],
  醫藥: ['掛號', '保健食品', '牙醫'],
  人際: ['伴侶', '親人', '朋友', '職場'],
  其他: ['繳稅'],
};

export const citySetting = {
  gridGap: 0,
  gridLength: 160,
  houseWidth: 120,
  cityPadding: 200,
};
