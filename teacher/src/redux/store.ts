// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import userReducer from './features/user/userSlice';
import teacherReducer from './features/teacher/teacherSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    teachers:teacherReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
