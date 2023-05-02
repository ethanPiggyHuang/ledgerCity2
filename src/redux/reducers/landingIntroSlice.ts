import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateActivity } from '../api/userAPI';
import { RootState } from '../store';

export interface PageControlState {
  demoHouses: { type: string }[][];
  chosenLabel: '食物' | '飲品' | '交通';
  isTrying: boolean;
  isFocusingLogin: boolean;
  isPlayingCarousel: boolean;
  introSection: 'ledger' | 'statistics' | 'cooperation';
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PageControlState = {
  demoHouses: [[{ type: '食物' }, { type: '' }, { type: '植物' }]],
  chosenLabel: '食物',
  isTrying: false,
  isFocusingLogin: false,
  isPlayingCarousel: true,
  introSection: 'ledger',
  status: 'idle',
};

export const SWITCH_PAGE = createAsyncThunk(
  'landingIntro/SWITCH_PAGE',
  async (payload: { userId: string }) => {
    const { userId } = payload;
  }
);

export const landingIntro = createSlice({
  name: 'landingIntro',
  initialState,
  reducers: {
    INTRO_CHOOSE_LABEL: (
      state,
      action: PayloadAction<'食物' | '飲品' | '交通'>
    ) => {
      state.chosenLabel = action.payload;
    },
    INTRO_LEDGER_SUBMIT: (state) => {
      state.demoHouses[0][1].type = state.chosenLabel;
      state.isTrying = true;
    },
    INTRO_CLEAR_HOUSE: (state) => {
      state.demoHouses[0][1].type = '';
      state.isTrying = false;
    },
    LOGIN_SECTION_FOCUS_TOGGLE: (state, action: PayloadAction<boolean>) => {
      state.isFocusingLogin = action.payload;
    },
    INTRO_SECTION_SWITCH: (
      state,
      action: PayloadAction<'ledger' | 'statistics' | 'cooperation'>
    ) => {
      state.introSection = action.payload;
    },
    CAROUSEL_PLAYING_TOGGLE: (state, action: PayloadAction<boolean>) => {
      state.isPlayingCarousel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SWITCH_PAGE.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(SWITCH_PAGE.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(SWITCH_PAGE.rejected, (state) => {
        state.status = 'failed';
        alert('登錄失敗');
      });
  },
});

export const {
  INTRO_CHOOSE_LABEL,
  INTRO_LEDGER_SUBMIT,
  INTRO_CLEAR_HOUSE,
  LOGIN_SECTION_FOCUS_TOGGLE,
  INTRO_SECTION_SWITCH,
  CAROUSEL_PLAYING_TOGGLE,
} = landingIntro.actions;

export default landingIntro.reducer;
