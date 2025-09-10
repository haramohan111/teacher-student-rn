import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  role: string | null; // student, admin, etc.
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  verified:boolean;
}

const initialState: AuthState = {
  user: null,
  role: null,
  status: 'idle',
  error: null,
  verified:false
};


// Signup student
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update displayName
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      // Add role + verified flag to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        role: 'student',
        verified: false,   // ✅ default verification status
        createdAt: new Date().toISOString(), // optional
      });

      return { ...userCredential.user, role: 'student', verified: false };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


// Login student
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Fetch role & verified status from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (!userDoc.exists()) {
        return rejectWithValue("User record not found in database");
      }

      const data = userDoc.data();
      const role = data.role || null;
      const verified = data.verified ?? false;

      // Block login if not verified
      if (!verified) {
        return rejectWithValue("Your account is not verified yet. Please wait for approval.");
      }

      return { ...userCredential.user, role, verified };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
  state.error = null;
  state.user = null;
  state.role = null;
  state.verified = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
