import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface cityState {
  housesPosition: number[][];
  gridsStatus: number[][];
  dragInfo: { target: number; pastIndex: { xIndex: number; yIndex: number } };
}

const initialState: cityState = {
  housesPosition: [
    [1, 2, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  gridsStatus: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  dragInfo: { target: 0, pastIndex: { xIndex: 0, yIndex: 0 } },
};

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
  },
});

export const { dropHouse, dragHouseStart, dragLightOn, dragLightOff } =
  cityArrangement.actions;

export default cityArrangement.reducer;
