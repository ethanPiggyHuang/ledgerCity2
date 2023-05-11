export interface HouseState {
  type: string;
  position: { xIndex: number; yIndex: number };
  height: number;
  ledgerId: string;
}

export interface CityBasicInfoState {
  accessUsers: string[];
  citizen: string[];
  cityName: string;
  houses: HouseState[];
  ledgerBookId: string;
}
