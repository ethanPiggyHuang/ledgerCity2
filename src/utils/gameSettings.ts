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

export const subLabels: { [key: string]: string[] } = {
  食物: ['早餐', '午餐', '晚餐'],
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
