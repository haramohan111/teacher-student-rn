import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import api from "../../../utils/axiosInstance"; // ✅ Axios instance

// ---------------- Types ---------------- //
export interface Teacher {
  id?: string;
  name: string;
  email: string;
  classbatch: string;
  subject: string;
  phone?: string;
  joinDate?: string;
  profileImageUrl?: string;
  profilePublicId?: string;
  password?: string;
}

export interface TeacherPayload extends Omit<Teacher, "id"> {
  profileFile?: File;
  id?: string;
}

interface TeacherState {
  teachers: Teacher[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TeacherState = {
  teachers: [],
  status: "idle",
  error: null,
};

// ---------------- Async Thunks (API calls) ---------------- //

// Fetch all teachers
export const fetchTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/teachers");
      return res.data as Teacher[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Fetch teacher by ID
export const fetchTeacherByIdAsync = createAsyncThunk(
  "teachers/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/teachers/${id}`);
      return res.data as Teacher;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Add teacher
export const addTeacherAsync = createAsyncThunk(
  "teachers/addTeacher",
  async (teacher: TeacherPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(teacher).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });
   for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const res = await api.post("/teachers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data as Teacher;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Update teacher
export const updateTeacherAsync = createAsyncThunk(
  "teachers/updateTeacher",
  async (teacher: TeacherPayload, { rejectWithValue }) => {
    try {
      if (!teacher.id) throw new Error("Teacher ID is required");

      const formData = new FormData();
      Object.entries(teacher).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      const res = await api.put(`/teachers/${teacher.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data as Teacher;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Delete teacher
export const deleteTeacherAsync = createAsyncThunk(
  "teachers/deleteTeacher",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/teachers/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// ---------------- Slice ---------------- //
const teacherSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTeachers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeachers.fulfilled, (state, action: PayloadAction<Teacher[]>) => {
        state.status = "succeeded";
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add
      .addCase(addTeacherAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTeacherAsync.fulfilled, (state, action: PayloadAction<Teacher>) => {
        state.status = "succeeded";
        state.teachers.push(action.payload);
      })
      .addCase(addTeacherAsync.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update
      .addCase(updateTeacherAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTeacherAsync.fulfilled, (state, action: PayloadAction<Teacher>) => {
        state.status = "succeeded";
        const index = state.teachers.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.teachers[index] = action.payload;
      })
      .addCase(updateTeacherAsync.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteTeacherAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTeacherAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.teachers = state.teachers.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTeacherAsync.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // fetch by id
      .addCase(fetchTeacherByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeacherByIdAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const teacher = action.payload;
        const existingIndex = state.teachers.findIndex((t) => t.id === teacher.id);
        if (existingIndex >= 0) {
          state.teachers[existingIndex] = teacher;
        } else {
          state.teachers.push(teacher);
        }
      })
      .addCase(fetchTeacherByIdAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch teacher";
      });
  },
});

// ---------------- Exports ---------------- //
export const { resetStatus } = teacherSlice.actions;
export const selectAllTeachers = (state: RootState) => state.teachers.teachers;
export const selectTeacherStatus = (state: RootState) => state.teachers.status;
export const selectTeacherError = (state: RootState) => state.teachers.error;
export const selectTeacherById = (state: RootState, id: string) =>
  state.teachers.teachers.find((teacher) => teacher.id === id);
export default teacherSlice.reducer;
