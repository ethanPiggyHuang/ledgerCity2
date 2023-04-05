import { createSlice } from '@reduxjs/toolkit'

export const gameMapSlice = createSlice({
  name: 'gameFields',
  initialState: {
    value: [1,2,0,0],
  },
  reducers: {
    shiftPosition: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = [0,0,1,2];
    },
    
  },
})

export const { shiftPosition } = gameMapSlice.actions

export default gameMapSlice.reducer