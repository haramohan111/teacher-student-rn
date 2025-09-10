import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth,db } from "../../../../firebase"; // adjust path to your firebase config
import { collection, query, where, getDocs } from "firebase/firestore";

export interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

// 🔑 Login Thunk
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Firebase Auth login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Query Firestore for teacher with matching uid
      const teacherQuery = query(
        collection(db, "teachers"),
        where("uid", "==", user.uid)
      );
      const teacherSnap = await getDocs(teacherQuery);

      if (teacherSnap.empty) {
        return rejectWithValue("No teacher profile found in database.");
      }

      const teacherData = teacherSnap.docs[0].data();

      // Return both auth info + teacher profile
      return {
        uid: user.uid,
        email: user.email,
        ...teacherData,
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 🚪 Logout Thunk
export const logoutAdmin = createAsyncThunk("auth/logoutAdmin", async () => {
  await signOut(auth);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.error = null;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
