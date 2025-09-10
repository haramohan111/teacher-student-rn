// src/redux/features/teacher/teacherSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { firestore } from '../../../../firebase'; // make sure this is your Firestore export
import { collection, getDocs } from 'firebase/firestore';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  status: 'Active' | 'Inactive';
}

interface TeacherState {
  teachers: Teacher[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TeacherState = {
  teachers: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch teachers from Firestore
export const fetchTeachers = createAsyncThunk(
  'teachers/fetchTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const teachersCol = collection(firestore, 'teachers');
      const snapshot = await getDocs(teachersCol);
      const teacherArray: Teacher[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Teacher));
      return teacherArray;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const teacherSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action: PayloadAction<Teacher[]>) => {
        state.status = 'succeeded';
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default teacherSlice.reducer;
