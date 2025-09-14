var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/redux/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebase";
const initialState = {
    user: null,
    status: "idle",
    error: null,
};
// 🔹 Login Thunk
// 🔹 Role-based Login
export const loginUser = createAsyncThunk("auth/loginUser", (_a, _b) => __awaiter(void 0, [_a, _b], void 0, function* ({ email, password }, { rejectWithValue }) {
    try {
        // 1. Sign in with Firebase Auth
        const userCred = yield signInWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;
        // 2. Fetch role from Firestore users collection
        const userDocRef = doc(db, "users", uid);
        const userSnapshot = yield getDoc(userDocRef);
        if (!userSnapshot.exists()) {
            return rejectWithValue("User data not found in Firestore");
        }
        const userData = userSnapshot.data();
        // 3. Return Auth state
        return {
            uid,
            email: userCred.user.email,
            role: userData.role || "user", // default fallback role
        };
    }
    catch (error) {
        return rejectWithValue(error.message);
    }
}));
// 🔹 Logout Thunk
export const logoutUser = createAsyncThunk("auth/logoutUser", () => __awaiter(void 0, void 0, void 0, function* () {
    yield signOut(auth);
}));
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
            .addCase(loginUser.fulfilled, (state, action) => {
            state.status = "idle";
            state.user = action.payload;
        })
            .addCase(loginUser.rejected, (state, action) => {
            var _a;
            state.status = "failed";
            state.error = (_a = action.payload) !== null && _a !== void 0 ? _a : "Login failed";
        })
            .addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.status = "idle";
            state.error = null;
        });
    },
});
export default authSlice.reducer;
