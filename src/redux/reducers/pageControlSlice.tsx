import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateActivity } from '../api/userAPI';
import { RootState } from '../store';

type CurrentActionState =
  | 'city'
  | 'rearrange'
  | 'ledger'
  | 'statistics'
  | 'profile'
  | 'leave';

type SocialSections = 'cooperated' | 'friend' | 'inviting';

export interface PageControlState {
  pageActivity: CurrentActionState;
  ledgerPosition: 'minimize' | 'normal' | 'expand';
  chartType: 'oneMonth' | 'monthly' | 'split';
  panelOpened: 'none' | 'user';
  socialSectionClosed: SocialSections[];
  landingScrollY: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PageControlState = {
  pageActivity: 'city',
  ledgerPosition: 'normal',
  chartType: 'oneMonth',
  panelOpened: 'none',
  socialSectionClosed: [],
  landingScrollY: 0,
  status: 'idle',
};

export const SWITCH_PAGE = createAsyncThunk(
  'pageControl/SWITCH_PAGE',
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
    CHANGE_LEDGER_POSITION: (
      state,
      action: PayloadAction<'minimize' | 'normal' | 'expand'>
    ) => {
      state.ledgerPosition = action.payload;
    },
    CHANGE_CHART_TYPE: (
      state,
      action: PayloadAction<'oneMonth' | 'monthly' | 'split'>
    ) => {
      state.chartType = action.payload;
    },
    PANEL_CONTROL: (state, action: PayloadAction<'none' | 'user'>) => {
      state.panelOpened = action.payload;
    },
    SOCIAL_SECTION_TOGGLE: (state, action: PayloadAction<SocialSections>) => {
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
    LANDING_SCROLL_Y: (state, action: PayloadAction<number>) => {
      const delta =
        state.landingScrollY + action.payload < 0 ? 0 : action.payload;
      state.landingScrollY = state.landingScrollY + delta;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SWITCH_PAGE.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(SWITCH_PAGE.fulfilled, (state, action) => {
        state.status = 'idle';
        state.pageActivity = action.payload;
      })
      .addCase(SWITCH_PAGE.rejected, (state) => {
        state.status = 'failed';
        alert('登錄失敗');
      });
  },
});

export const {
  CHANGE_LEDGER_POSITION,
  CHANGE_CHART_TYPE,
  PANEL_CONTROL,
  SOCIAL_SECTION_TOGGLE,
  LANDING_SCROLL_Y,
} = pageControl.actions;

export default pageControl.reducer;
