import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authslice'
import dashboardReducer from './slices/dashboardSlice'
import walletReducer from './slices/walletSlice'
import customersReducer from './slices/customersSlice'
import passbookReducer from './slices/passbookSlice'
import { persistStore, persistReducer } from 'redux-persist';
import authSlice from './slices/authslice';
import printHistoryReducer from "./slices/printHistorySlice";
import profileReducer from './slices/profileSlice'
import accountOpeningReducer from './slices/accountOpeningSlice';


import storage from 'redux-persist/lib/storage'; // localStorage

const persistConfig = {
  key: 'auth',
  storage,
  // ✅ Persist specific fields only
  whitelist: ['user', 'admin', 'isAuthenticated', 'isAdminAuthenticated'],
};

const persistedReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    dashboard: dashboardReducer,
    wallet: walletReducer,
    customers: customersReducer,
    passbook: passbookReducer,
    printHistory: printHistoryReducer,
    profile: profileReducer,
     accountOpening: accountOpeningReducer,

  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
})

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch