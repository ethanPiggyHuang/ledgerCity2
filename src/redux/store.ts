import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../feature/counter/counterSlice';
import cityBasicInfoReducer from './reducers/cityBasicInfoSlice';
import cityArrangementReducer from './reducers/cityArrangementSlice';
import ledgerSingleReducer from './reducers/ledgerSingleSlice';
import ledgerListReducer from './reducers/ledgerListSlice';
import userInfoReducer from './reducers/userInfoSlice';
import userActivityReducer from './reducers/usersActivitySlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cityBasicInfo: cityBasicInfoReducer,
    cityArrangement: cityArrangementReducer,
    ledgerSingle: ledgerSingleReducer,
    ledgerList: ledgerListReducer,
    userInfo: userInfoReducer,
    userActivity: userActivityReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
