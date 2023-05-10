import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateActivity } from '../api/userAPI';

export type CurrentActionState =
  | 'city'
  | 'rearrange'
  | 'ledger'
  | 'statistics'
  | 'profile'
  | 'leave';

type SocialSections = 'cooperated' | 'friend' | 'inviting' | 'search';

export interface PageControlState {
  pageActivity: CurrentActionState;
  ledgerPosition: 'minimize' | 'normal' | 'expand';
  statisticsMode: 'yearAndMonth' | 'monthOnly' | 'monthAndDetail';
  panelOpened: 'none' | 'user';
  socialSectionClosed: SocialSections[];
  alert: {
    isShown: boolean;
    dialogueOpen: boolean;
  };
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PageControlState = {
  pageActivity: 'city',
  ledgerPosition: 'normal',
  statisticsMode: 'monthOnly',
  panelOpened: 'none',
  socialSectionClosed: ['search'],
  alert: {
    isShown: false,
    dialogueOpen: false,
  },
  status: 'idle',
};

export const SWITCH_SECTION_FOCUSED = createAsyncThunk(
  'pageControl/SWITCH_SECTION_FOCUSED',
  async (payload: { userId: string; pageActivity: CurrentActionState }) => {
    const { userId, pageActivity } = payload;
    await updateActivity(userId, pageActivity);
    return pageActivity;
  }
);

export const pageControl = createSlice({
  name: 'pageControl',
  initialState,
  reducers: {
    SWITCH_LEDGER_POSITION: (
      state,
      action: PayloadAction<'minimize' | 'normal' | 'expand'>
    ) => {
      state.ledgerPosition = action.payload;
    },
    CONTROL_PANEL_DISPLAYED: (
      state,
      action: PayloadAction<'none' | 'user'>
    ) => {
      state.panelOpened = action.payload;
    },
    TOGGLE_SOCIAL_SECTION: (state, action: PayloadAction<SocialSections>) => {
      if (state.socialSectionClosed.includes(action.payload)) {
        state.socialSectionClosed = state.socialSectionClosed.filter(
          (section) => section !== action.payload
        );
      } else {
        state.socialSectionClosed = [
          ...state.socialSectionClosed,
          action.payload,
        ];
      }
    },
    SWITCH_STATISTICS_MODE: (
      state,
      action: PayloadAction<'yearAndMonth' | 'monthOnly' | 'monthAndDetail'>
    ) => {
      state.statisticsMode = action.payload;
    },
    TOGGLE_ALERT_CURTAIN: (state) => {
      state.alert.isShown = !state.alert.isShown;
    },
    TOGGLE_ALERT_DIALOUGE: (state) => {
      state.alert.dialogueOpen = !state.alert.dialogueOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SWITCH_SECTION_FOCUSED.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(SWITCH_SECTION_FOCUSED.fulfilled, (state, action) => {
        state.status = 'idle';
        state.pageActivity = action.payload;
      })
      .addCase(SWITCH_SECTION_FOCUSED.rejected, (state) => {
        state.status = 'failed';
        alert('登錄失敗');
      });
  },
});

export const {
  SWITCH_LEDGER_POSITION,
  CONTROL_PANEL_DISPLAYED,
  TOGGLE_SOCIAL_SECTION,
  SWITCH_STATISTICS_MODE,
  TOGGLE_ALERT_CURTAIN,
  TOGGLE_ALERT_DIALOUGE,
} = pageControl.actions;

export default pageControl.reducer;
