import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCity, saveCity } from './cityAPI';

export interface CityState {
  housesPosition: number[][];
  gridsStatus: number[][];
  dragInfo: { target: number; pastIndex: { xIndex: number; yIndex: number } };
  status: 'idle' | 'loading' | 'failed';
  isHouseDraggable: boolean;
}

const initialState: CityState = {
  housesPosition: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  gridsStatus: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  dragInfo: { target: 0, pastIndex: { xIndex: 0, yIndex: 0 } },
  status: 'idle',
  isHouseDraggable: false,
};

export const fetchCityAsync = createAsyncThunk('city/fetchCity', async () => {
  const response = await fetchCity();
  // The value we return becomes the `fulfilled` action payload
  return response.data;
});

export const saveCityAsync = createAsyncThunk('city/saveCity', async () => {
  const response = await saveCity();
  // The value we return becomes the `fulfilled` action payload
  return response.data;
});

export const cityArrangement = createSlice({
  name: 'housesPosition',
  initialState,
  reducers: {
    dropHouse: (
      state,
      action: PayloadAction<{
        yIndex: number;
        xIndex: number;
      }>
    ) => {
      if (
        state.housesPosition[action.payload.yIndex][action.payload.xIndex] === 0
      ) {
        state.housesPosition[state.dragInfo.pastIndex.yIndex][
          state.dragInfo.pastIndex.xIndex
        ] = 0;
        state.housesPosition[action.payload.yIndex][action.payload.xIndex] =
          state.dragInfo.target;
        state.dragInfo.target = 0;
      }
      return state;
    },
    dragHouseStart: (
      state,
      action: PayloadAction<{
        target: number;
        pastIndex: { xIndex: number; yIndex: number };
      }>
    ) => {
      state.dragInfo = {
        target: action.payload.target,
        pastIndex: action.payload.pastIndex,
      };
      return state;
    },
    dragLightOn: (
      state,
      action: PayloadAction<{
        yIndex: number;
        xIndex: number;
      }>
    ) => {
      if (state.dragInfo.target !== 0) {
        if (
          (action.payload.xIndex === state.dragInfo.pastIndex.xIndex &&
            action.payload.yIndex === state.dragInfo.pastIndex.yIndex) ||
          state.housesPosition[action.payload.yIndex][action.payload.xIndex] ===
            0
        ) {
          state.gridsStatus[action.payload.yIndex][action.payload.xIndex] = 1;
        } else {
          state.gridsStatus[action.payload.yIndex][action.payload.xIndex] = -1;
        }
      }
      return state;
    },
    dragLightOff: (state) => {
      state.gridsStatus = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      return state;
    },
    draggableSwitch: (state) => {
      state.isHouseDraggable = !state.isHouseDraggable;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCityAsync.fulfilled, (state, action) => {
        action.payload.forEach((house) => {
          let type: number = 0;
          switch (house.type) {
            case 'food':
              type = 1;
              break;
            case 'clothes':
              type = 2;
              break;
            case 'transportation':
              type = 3;
              break;
            default:
              break;
          }
          state.housesPosition[house.position.y][house.position.x] = type; //TODO FIX typescript
          console.log(house);
        });
        state.status = 'idle';
        return state;
      })
      .addCase(fetchCityAsync.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(saveCityAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveCityAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        alert('城市重建結果已紀錄');
        return state;
      })
      .addCase(saveCityAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const {
  dropHouse,
  dragHouseStart,
  dragLightOn,
  dragLightOff,
  draggableSwitch,
} = cityArrangement.actions;

export default cityArrangement.reducer;
