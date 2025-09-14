var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/redux/features/student/studentSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../../../firebase";
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
const initialState = {
    students: [],
    status: "idle",
    error: null,
};
// ✅ Fetch Students
export const fetchStudents = createAsyncThunk("students/fetchStudents", () => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield getDocs(collection(db, "users"));
    const students = snapshot.docs.map((docSnap, index) => {
        var _a;
        return (Object.assign(Object.assign({ id: index + 1, uid: docSnap.id }, docSnap.data()), { verified: (_a = docSnap.data().verified) !== null && _a !== void 0 ? _a : false }));
    });
    return students;
}));
// ✅ Add Student
export const addStudent = createAsyncThunk("students/addStudent", (studentData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Save to Firestore
    const docRef = yield addDoc(collection(db, "users"), Object.assign(Object.assign({}, studentData), { verified: (_a = studentData.verified) !== null && _a !== void 0 ? _a : false }));
    // Return student with generated Firestore UID
    return Object.assign(Object.assign({}, studentData), { uid: docRef.id, id: Date.now() });
}));
// ✅ Toggle Verified
export const toggleVerified = createAsyncThunk("students/toggleVerified", (_a) => __awaiter(void 0, [_a], void 0, function* ({ uid, verified }) {
    const userRef = doc(db, "users", uid);
    yield updateDoc(userRef, { verified });
    return { uid, verified };
}));
const studentSlice = createSlice({
    name: "students",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchStudents.pending, (state) => {
            state.status = "loading";
        })
            .addCase(fetchStudents.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.students = action.payload;
        })
            .addCase(fetchStudents.rejected, (state, action) => {
            var _a;
            state.status = "failed";
            state.error = (_a = action.error.message) !== null && _a !== void 0 ? _a : "Failed to fetch students";
        })
            // Add Student
            .addCase(addStudent.fulfilled, (state, action) => {
            state.students.push(action.payload);
        })
            // Toggle Verified
            .addCase(toggleVerified.fulfilled, (state, action) => {
            const student = state.students.find((s) => s.uid === action.payload.uid);
            if (student) {
                student.verified = action.payload.verified;
            }
        });
    },
});
export default studentSlice.reducer;
