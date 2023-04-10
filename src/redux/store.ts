import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../feature/counter/counterSlice';
import cityBasicInfoReducer from './reducers/cityBasicInfoSlice';
import cityArrangementReducer from './reducers/cityArrangementSlice';
import ledgerSingleReducer from './reducers/ledgerSingleSlice';
import ledgerListReducer from './reducers/ledgerListSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cityBasicInfo: cityBasicInfoReducer,
    cityArrangement: cityArrangementReducer,
    ledgerSingle: ledgerSingleReducer,
    ledgerList: ledgerListReducer,
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