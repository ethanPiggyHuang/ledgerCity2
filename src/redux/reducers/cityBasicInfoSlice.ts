import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCityInfo, updateCityName } from '../api/cityAPI';

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
  status?: 'idle' | 'loading' | 'failed';
}

const initialState: CityBasicInfoState = {
  accessUsers: [],
  citizen: [],
  cityName: '',
  houses: [],
  ledgerBookId: '',
  status: 'idle',
};

export const getCityInfo = createAsyncThunk(
  'cityBasicInfo/getCityInfo',
  async (cityId: string) => {
    try {
      const response = await fetchCityInfo(cityId);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

// export const CHANGE_CITY_NAME = createAsyncThunk(
//   'cityBasicInfo/getCityInfo',
//   async (payload: { cityId: string; cityName: string }) => {
//     try {
//       const { cityId, cityName } = payload;
//       const response = await updateCityName(cityId, cityName);
//       return response.data;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

export const cityBasicInfo = createSlice({
  name: 'cityBasicInfo',
  initialState,
  reducers: {
    UPDATE_CITY_INFO: (state, action: PayloadAction<CityBasicInfoState>) => {
      state.cityName = action.payload.cityName;
      state.accessUsers = action.payload.accessUsers;
      state.citizen = action.payload.citizen;
      state.houses = action.payload.houses;
      state.ledgerBookId = action.payload.ledgerBookId;
      state.status = 'idle';
    },
    CHANGE_CITY_NAME: (state, action: PayloadAction<string>) => {
      state.cityName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCityInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCityInfo.fulfilled, (state, action) => {
        console.log('gg', action.payload);
        if (action.payload) {
          state.cityName = action.payload.cityName;
          state.accessUsers = action.payload.accessUsers;
          state.citizen = action.payload.citizen;
          state.houses = action.payload.houses;
          state.ledgerBookId = action.payload.ledgerBookId;
        }
        state.status = 'idle';
      })
      .addCase(getCityInfo.rejected, (state) => {
        state.status = 'failed';
        alert('getCityInfo rejected');
      });
    // .addCase(CHANGE_CITY_NAME.pending, (state) => {
    //   state.status = 'loading';
    // })
    // .addCase(CHANGE_CITY_NAME.fulfilled, (state, action) => {
    //   console.log('gg', action.payload);
    //   if (action.payload) {
    //     state.cityName = action.payload.cityName;
    //     state.accessUsers = action.payload.accessUsers;
    //     state.citizen = action.payload.citizen;
    //     state.houses = action.payload.houses;
    //     state.ledgerBookId = action.payload.ledgerBookId;
    //   }
    //   state.status = 'idle';
    // })
    // .addCase(CHANGE_CITY_NAME.rejected, (state) => {
    //   state.status = 'failed';
    //   alert('getCityInfo rejected');
    // })
  },
});

export const { UPDATE_CITY_INFO, CHANGE_CITY_NAME } = cityBasicInfo.actions;

export default cityBasicInfo.reducer;
