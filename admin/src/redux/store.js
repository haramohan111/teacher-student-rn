// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import studentReducer from './features/student/studentSlice';
import teacherReducer from './features/teacher/teacherSlice';
import messageReducer from './features/messageSlice';
// Configure the store
export const store = configureStore({
    reducer: {
        auth: authReducer,
        students: studentReducer, // student slice
        teachers: teacherReducer, // teacher slice
        messages: messageReducer, // messages slice
    },
});
