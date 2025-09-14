var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/axiosInstance"; // ✅ Axios instance
const initialState = {
    teachers: [],
    status: "idle",
    error: null,
};
// ---------------- Async Thunks (API calls) ---------------- //
// Fetch all teachers
export const fetchTeachers = createAsyncThunk("teachers/fetchTeachers", (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { rejectWithValue }) {
    var _b, _c;
    try {
        const res = yield api.get("/teachers");
        return res.data;
    }
    catch (err) {
        return rejectWithValue(((_c = (_b = err.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) || err.message);
    }
}));
// Fetch teacher by ID
export const fetchTeacherByIdAsync = createAsyncThunk("teachers/fetchById", (id_1, _a) => __awaiter(void 0, [id_1, _a], void 0, function* (id, { rejectWithValue }) {
    var _b, _c;
    try {
        const res = yield api.get(`/teachers/${id}`);
        return res.data;
    }
    catch (err) {
        return rejectWithValue(((_c = (_b = err.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) || err.message);
    }
}));
// Add teacher
export const addTeacherAsync = createAsyncThunk("teachers/addTeacher", (teacher_1, _a) => __awaiter(void 0, [teacher_1, _a], void 0, function* (teacher, { rejectWithValue }) {
    var _b, _c;
    try {
        const formData = new FormData();
        Object.entries(teacher).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }
        const res = yield api.post("/teachers", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    }
    catch (err) {
        return rejectWithValue(((_c = (_b = err.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) || err.message);
    }
}));
// Update teacher
export const updateTeacherAsync = createAsyncThunk("teachers/updateTeacher", (teacher_1, _a) => __awaiter(void 0, [teacher_1, _a], void 0, function* (teacher, { rejectWithValue }) {
    var _b, _c;
    try {
        if (!teacher.id)
            throw new Error("Teacher ID is required");
        const formData = new FormData();
        Object.entries(teacher).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });
        const res = yield api.put(`/teachers/${teacher.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    }
    catch (err) {
        return rejectWithValue(((_c = (_b = err.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) || err.message);
    }
}));
// Delete teacher
export const deleteTeacherAsync = createAsyncThunk("teachers/deleteTeacher", (id_1, _a) => __awaiter(void 0, [id_1, _a], void 0, function* (id, { rejectWithValue }) {
    var _b, _c;
    try {
        yield api.delete(`/teachers/${id}`);
        return id;
    }
    catch (err) {
        return rejectWithValue(((_c = (_b = err.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) || err.message);
    }
}));
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
            .addCase(fetchTeachers.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.teachers = action.payload;
        })
            .addCase(fetchTeachers.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        })
            // Add
            .addCase(addTeacherAsync.pending, (state) => {
            state.status = "loading";
        })
            .addCase(addTeacherAsync.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.teachers.push(action.payload);
        })
            .addCase(addTeacherAsync.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        })
            // Update
            .addCase(updateTeacherAsync.pending, (state) => {
            state.status = "loading";
        })
            .addCase(updateTeacherAsync.fulfilled, (state, action) => {
            state.status = "succeeded";
            const index = state.teachers.findIndex((t) => t.id === action.payload.id);
            if (index !== -1)
                state.teachers[index] = action.payload;
        })
            .addCase(updateTeacherAsync.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        })
            // Delete
            .addCase(deleteTeacherAsync.pending, (state) => {
            state.status = "loading";
        })
            .addCase(deleteTeacherAsync.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.teachers = state.teachers.filter((t) => t.id !== action.payload);
        })
            .addCase(deleteTeacherAsync.rejected, (state, action) => {
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
            }
            else {
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
export const selectAllTeachers = (state) => state.teachers.teachers;
export const selectTeacherStatus = (state) => state.teachers.status;
export const selectTeacherError = (state) => state.teachers.error;
export const selectTeacherById = (state, id) => state.teachers.teachers.find((teacher) => teacher.id === id);
export default teacherSlice.reducer;
