import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FETCH_COORPERATE_LOCATION } from '../api/userAPI';
import { DocumentData } from '@firebase/firestore-types';

interface SoloUserActivityState {
  currentPage: 'city' | 'ledger' | 'statistics' | 'profile' | 'leave';
  fadeOutTime: number;
  isEditingCity: boolean;
  latestActiveTime: number;
}

export interface UsersActivityState {
  status: 'idle' | 'loading' | 'failed';
  data: { [userId: string]: SoloUserActivityState } | {};
}

const initialState: UsersActivityState = {
  status: 'idle',
  data: {},
};

export const usersActivity = createSlice({
  name: 'usersActivity',
  initialState,
  reducers: {
    GET_COOP_FRIEND_ACTIVITY: (
      state,
      action: PayloadAction<{
        userId: string;
        currentPage: 'city' | 'ledger' | 'statistics' | 'profile' | 'leave';
        isEditingCity: boolean;
        fadeOutTimeSecond: number;
        latestActiveTimeSecond: number;
      }>
    ) => {
      if (action.payload) {
        // const { userId } = action.payload;
        // state.data[userId] = action.payload;
      }
    },
  },
});

export const { GET_COOP_FRIEND_ACTIVITY } = usersActivity.actions;

export default usersActivity.reducer;
