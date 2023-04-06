import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface cityState {
  housesPosition: number[];
  gridsStatus: number[];
  dragInfo: { target: number; pastIndex: number };
}

const initialState: cityState = {
  housesPosition: [1, 2, 0, 0, 0, 0],
  gridsStatus: [1, 2, 0, 0, 0, 0].fill(0),
  dragInfo: { target: 0, pastIndex: 0 },
};

export const cityArrangement = createSlice({
  name: 'housesPosition',
  initialState,
  reducers: {
    dropHouse: (
      state,
      action: PayloadAction<{
        index: number;
      }>
    ) => {
      if (state.housesPosition[action.payload.index] === 0) {
        state.housesPosition[state.dragInfo.pastIndex] = 0;
        state.housesPosition[action.payload.index] = state.dragInfo.target;
        state.dragInfo.target = 0;
      }
      return state;
    },
    dragHouseStart: (
      state,
      action: PayloadAction<{
        target: number;
        pastIndex: number;
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
        index: number;
      }>
    ) => {
      if (state.dragInfo.target !== 0) {
        if (
          action.payload.index === state.dragInfo.pastIndex ||
          state.housesPosition[action.payload.index] === 0
        ) {
          state.gridsStatus[action.payload.index] = 1;
        } else {
          state.gridsStatus[action.payload.index] = -1;
        }
      }
      return state;
    },
    dragLightOff: (state) => {
      state.gridsStatus = state.gridsStatus.fill(0);
      return state;
    },
  },
});

export const { dropHouse, dragHouseStart, dragLightOn, dragLightOff } =
  cityArrangement.actions;

export default cityArrangement.reducer;
