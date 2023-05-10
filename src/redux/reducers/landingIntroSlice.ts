import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export const landingIntro = createSlice({
  name: 'landingIntro',
  initialState,
  reducers: {
    CHOOSE_LABEL: (state, action: PayloadAction<'食物' | '飲品' | '交通'>) => {
      state.chosenLabel = action.payload;
    },
    SUBMIT_LEDGER: (state) => {
      state.demoHouses[0][1].type = state.chosenLabel;
      state.isTrying = true;
    },
    CLEAR_HOUSE: (state) => {
      state.demoHouses[0][1].type = '';
      state.isTrying = false;
    },
    TOGGLE_LOGIN_SECTION_FOCUS: (state, action: PayloadAction<boolean>) => {
      state.isFocusingLogin = action.payload;
    },
    SWITCH_INTRO_SECTION: (
      state,
      action: PayloadAction<'ledger' | 'statistics' | 'cooperation'>
    ) => {
      state.introSection = action.payload;
    },
    TOGGLE_CAROUSEL_PLAYING: (state, action: PayloadAction<boolean>) => {
      state.isPlayingCarousel = action.payload;
    },
  },
});

export const {
  CHOOSE_LABEL,
  SUBMIT_LEDGER,
  CLEAR_HOUSE,
  TOGGLE_LOGIN_SECTION_FOCUS,
  SWITCH_INTRO_SECTION,
  TOGGLE_CAROUSEL_PLAYING,
} = landingIntro.actions;

export default landingIntro.reducer;
