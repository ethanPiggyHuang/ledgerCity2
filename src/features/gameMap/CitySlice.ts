import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface housesPositionState {
  value: number[];
}

const initialState: housesPositionState = {
  value: [1, 2, 0, 0, 0, 0],
};

export const housesPositionSlice = createSlice({
  name: 'housesPosition',
  initialState,
  reducers: {
    dropHouse: (
      state,
      action: PayloadAction<{
        index: number;
        target: number;
        pastIndex: number;
      }>
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      if (state.value[action.payload.index] === 0) {
        state.value[action.payload.pastIndex] = 0;
        state.value[action.payload.index] = action.payload.target;
      }
      return state;
    },

    // (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

export const { dropHouse } = housesPositionSlice.actions;

export default housesPositionSlice.reducer;
