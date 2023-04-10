import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateHousePosition } from '../api/cityAPI';
import { CityBasicInfoState, HouseState } from './cityBasicInfoSlice';

export interface CityArrangementState {
  housesPosition: { type: string; id: string }[][];
  gridsStatus: number[][];
  dragInfo: {
    id: string;
    target: string;
    pastIndex: { xIndex: number; yIndex: number };
  };
  status: 'idle' | 'loading' | 'failed';
  isHouseDraggable: boolean;
}

const initialState: CityArrangementState = {
  housesPosition: [
    [
      { type: '', id: '' },
      { type: '', id: '' },
      { type: '', id: '' },
    ],
    [
      { type: '', id: '' },
      { type: '', id: '' },
      { type: '', id: '' },
    ],
    [
      { type: '', id: '' },
      { type: '', id: '' },
      { type: '', id: '' },
    ],
  ],
  gridsStatus: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  dragInfo: { id: '', target: '', pastIndex: { xIndex: 0, yIndex: 0 } },
  status: 'idle',
  isHouseDraggable: false,
};

export const saveCityAsync = createAsyncThunk(
  'cityArrangement/saveCity',
  async (houses: HouseState[], { getState }) => {
    const cityId: string = 'YFbhq5M8vFBIUMMWZhqo'; //TODO: import cityId from other State
    const allStates = getState() as any; //TODO
    const houseIds = houses.map((house) => house.ledgerId);
    const housesPosition: { type: number; id: string }[][] =
      allStates.cityArrangement.housesPosition;

    let newPostions: { [key: string]: { xIndex: number; yIndex: number } } = {};
    housesPosition.forEach((raw, yIndex) => {
      raw.forEach((grid, xIndex) => {
        const index = houseIds.findIndex((id) => id === grid.id);
        if (index > -1) newPostions[grid.id] = { yIndex, xIndex };
      });
    });
    const newHouses = houses.map((house) => {
      return { ...house, position: newPostions[house.ledgerId] };
    });
    await updateHousePosition(cityId, newHouses);
  }
);

export const cityArrangement = createSlice({
  name: 'cityArrangement',
  initialState,
  reducers: {
    displayCity: (state, action: PayloadAction<CityBasicInfoState>) => {
      if (action.payload.accessUsers.length !== 0) {
        action.payload.houses.forEach((house) => {
          state.housesPosition[house.position.yIndex][house.position.xIndex] = {
            type: house.type,
            id: house.ledgerId,
          }; //TODO FIX typescript
        });
      }
      return state;
    },
    dropHouse: (
      state,
      action: PayloadAction<{
        yIndex: number;
        xIndex: number;
      }>
    ) => {
      const { yIndex, xIndex } = action.payload;
      const pastYIndex = state.dragInfo.pastIndex.yIndex;
      const pastXIndex = state.dragInfo.pastIndex.xIndex;
      if (state.housesPosition[yIndex][xIndex].type === '') {
        state.housesPosition[pastYIndex][pastXIndex] = { type: '', id: '' };
        state.housesPosition[yIndex][xIndex] = {
          type: state.dragInfo.target,
          id: state.dragInfo.id,
        };
        state.dragInfo.target = '';
        state.dragInfo.id = '';
      }
      state.gridsStatus = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      return state;
    },
    dragHouseStart: (
      state,
      action: PayloadAction<{
        id: string;
        target: string;
        pastIndex: { xIndex: number; yIndex: number };
      }>
    ) => {
      state.dragInfo = {
        id: action.payload.id,
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
      if (state.dragInfo.target !== '') {
        if (
          (action.payload.xIndex === state.dragInfo.pastIndex.xIndex &&
            action.payload.yIndex === state.dragInfo.pastIndex.yIndex) ||
          state.housesPosition[action.payload.yIndex][action.payload.xIndex]
            .type === ''
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
      .addCase(saveCityAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveCityAsync.fulfilled, (state) => {
        state.status = 'idle';
        state.isHouseDraggable = false;
        alert('街道重建已紀錄');
        return state;
      })
      .addCase(saveCityAsync.rejected, (state) => {
        state.status = 'failed';
        alert('街道重建儲存失敗');
      });
  },
});

export const {
  displayCity,
  dropHouse,
  dragHouseStart,
  dragLightOn,
  dragLightOff,
  draggableSwitch,
} = cityArrangement.actions;

export default cityArrangement.reducer;
