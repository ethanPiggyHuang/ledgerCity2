import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateHousePosition } from './gameMapAPI';
import { CityInfoState, HouseState } from './gameMapSlice';

export interface CityState {
  housesPosition: { type: number; id: string }[][];
  gridsStatus: number[][];
  dragInfo: {
    id: string;
    target: number;
    pastIndex: { xIndex: number; yIndex: number };
  };
  status: 'idle' | 'loading' | 'failed';
  isHouseDraggable: boolean;
}

const initialState: CityState = {
  housesPosition: [
    [
      { type: 0, id: '' },
      { type: 0, id: '' },
      { type: 0, id: '' },
    ],
    [
      { type: 0, id: '' },
      { type: 0, id: '' },
      { type: 0, id: '' },
    ],
    [
      { type: 0, id: '' },
      { type: 0, id: '' },
      { type: 0, id: '' },
    ],
  ],
  gridsStatus: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  dragInfo: { id: '', target: 0, pastIndex: { xIndex: 0, yIndex: 0 } },
  status: 'idle',
  isHouseDraggable: false,
};

export const saveCityAsync = createAsyncThunk(
  'city/saveCity',
  async (houses: HouseState[], { getState }) => {
    const cityId: string = 'YFbhq5M8vFBIUMMWZhqo'; //TODO: import from other State
    const data = getState() as any; //TODO
    const housesPosition: { type: number; id: string }[][] =
      data.cityArrangement.housesPosition;
    const houseIds = houses.map((house) => house.ledgerId);

    let newPostions: { [key: string]: { x: number; y: number } } = {};
    housesPosition.forEach((raw, yIndex) => {
      raw.forEach((grid, xIndex) => {
        const index = houseIds.findIndex((id) => id === grid.id);
        if (index > -1) newPostions[grid.id] = { y: yIndex, x: xIndex };
      });
    });
    const newHouses = houses.map((house) => {
      return { ...house, position: newPostions[house.ledgerId] };
    });

    await updateHousePosition(cityId, newHouses);
  }
);

export const cityArrangement = createSlice({
  name: 'housesPosition',
  initialState,
  reducers: {
    displayCity: (state, action: PayloadAction<CityInfoState>) => {
      if (action.payload.accessUsers.length !== 0) {
        action.payload.houses.forEach((house) => {
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
          state.housesPosition[house.position.y][house.position.x] = {
            type: type,
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
      if (state.housesPosition[yIndex][xIndex].type === 0) {
        state.housesPosition[pastYIndex][pastXIndex] = { type: 0, id: '' };
        state.housesPosition[yIndex][xIndex] = {
          type: state.dragInfo.target,
          id: state.dragInfo.id,
        };
        state.dragInfo.target = 0;
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
        target: number;
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
      if (state.dragInfo.target !== 0) {
        if (
          (action.payload.xIndex === state.dragInfo.pastIndex.xIndex &&
            action.payload.yIndex === state.dragInfo.pastIndex.yIndex) ||
          state.housesPosition[action.payload.yIndex][action.payload.xIndex]
            .type === 0
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
