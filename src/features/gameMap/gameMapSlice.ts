import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCityInfo } from './gameMapAPI';

export interface HouseState {
  type: string;
  position: { xIndex: number; yIndex: number };
  height: number;
  ledgerId: string;
}

export interface CityInfoState {
  accessUsers: { id: string; name: string }[];
  citizen: string[];
  cityName: string;
  houses: HouseState[];
  ledgerBookId: string;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CityInfoState = {
  accessUsers: [],
  citizen: [],
  cityName: '',
  houses: [],
  ledgerBookId: '',
  status: 'idle',
};

export const getCityInfo = createAsyncThunk(
  'gameMap/fetchCityInfo',
  async () => {
    const cityId: string = 'YFbhq5M8vFBIUMMWZhqo'; //TODO: import from other State
    const response = await fetchCityInfo(cityId);
    return response.data;
  }
);

export const gameMainInfo = createSlice({
  name: 'gameMainInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCityInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCityInfo.fulfilled, (state, action) => {
        state = { ...action.payload, status: 'idle' };
        console.log(
          state.houses.map((house) => {
            return {
              type: house.type,
              pos: house.position,
            };
          })
        );
        return state;
      })
      .addCase(getCityInfo.rejected, (state) => {
        state.status = 'failed';
        alert('getCityInfo rejected');
      });
  },
});

// export const {} = GameMainInfo.actions;

export default gameMainInfo.reducer;
