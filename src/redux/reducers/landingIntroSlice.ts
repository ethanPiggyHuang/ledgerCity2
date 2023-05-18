import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PageControlState {
  demoHouses: { type: string }[][];
  chosenLabel: '食物' | '飲品' | '交通';
  isTrying: boolean;
  isFocusingLogin: boolean;
  isPlayingCarousel: boolean;
  introSection: 'ledger' | 'statistics' | 'cooperation';
  isNewRegister: boolean;
  loginInput: {
    email: string;
    password: string;
    isPasswordVisibile: boolean;
  };
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PageControlState = {
  demoHouses: [[{ type: '食物' }, { type: '' }, { type: '植物' }]],
  chosenLabel: '食物',
  isTrying: false,
  isFocusingLogin: false,
  isPlayingCarousel: true,
  introSection: 'ledger',
  isNewRegister: false,
  loginInput: {
    email: 'example@gmail.com',
    password: '123456',
    isPasswordVisibile: true,
  },
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
    EDIT_LOGIN_INPUT: (
      state,
      action: PayloadAction<{ field: 'email' | 'password'; value: string }>
    ) => {
      const { field, value } = action.payload;
      state.loginInput[field] = value;
    },
    TOGGLE_PASSWORD_VISIBILITY: (state) => {
      state.loginInput.isPasswordVisibile =
        !state.loginInput.isPasswordVisibile;
    },
    TOGGLE_NEW_REGISTER: (state) => {
      state.isNewRegister = !state.isNewRegister;
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
  EDIT_LOGIN_INPUT,
  TOGGLE_PASSWORD_VISIBILITY,
  TOGGLE_NEW_REGISTER,
} = landingIntro.actions;

export default landingIntro.reducer;
