// src/redux/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../../services/api";

// ✅ Interfaces
export interface User {
  id: any;
  status: any;
  role: any;
  firstName: any;
  lastName: any;
  lastLogin: string | number | Date;
  _id: string;
  name: string;
  email: string;
  phone?: string;
  // add other fields as needed
}

interface UsersState {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: UsersState = {
  users: [],
  status: "idle",
  error: null,
};

// Thunks
export const addUser = createAsyncThunk<User, Partial<User>, { rejectValue: string }>(
  "users/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post<{ user: User }>("/add-member", userData);
      return response.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<{ users: User[] }>("/get-users");
      return response.data.users;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateUser = createAsyncThunk<User, { id: string; updates: Partial<User> }, { rejectValue: string }>(
  "users/updateUser",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await api.put<{ user: User }>(`/update-user/${id}`, updates);
      return response.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/delete-user/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // addUser
    builder.addCase(addUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.status = "succeeded";
      state.users.push(action.payload);
    });
    builder.addCase(addUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload ?? "Failed to add user";
    });

    // fetchUsers
    builder.addCase(fetchUsers.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.status = "succeeded";
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload ?? "Failed to fetch users";
    });

    // updateUser
    builder.addCase(updateUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.status = "succeeded";
      const index = state.users.findIndex((u) => u._id === action.payload._id);
      if (index !== -1) state.users[index] = action.payload;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload ?? "Failed to update user";
    });

    // deleteUser
    builder.addCase(deleteUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
      state.status = "succeeded";
      state.users = state.users.filter((u) => u._id !== action.payload);
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload ?? "Failed to delete user";
    });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
