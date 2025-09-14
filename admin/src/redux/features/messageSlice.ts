import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { RootState } from "../store";

// Message interface
export interface Message {
  id?: string;
  text: string;
  sender: string;
  createdAt: any;
  appointmentId: string;
}

// Slice state interface
interface MessageState {
  messages: { [appointmentId: string]: Message[] }; // store per appointment
  loading: boolean;
  error: string | null;
}

const initialState: MessageState = {
  messages: {},
  loading: false,
  error: null,
};

// ✅ Fetch messages for an appointment
export const fetchMessages = createAsyncThunk<
  { appointmentId: string; messages: Message[] },
  string,
  { rejectValue: string }
>("messages/fetchMessages", async (appointmentId, { rejectWithValue }) => {
  try {
    const q = query(
      collection(db, "appointments", appointmentId, "messages"),
      orderBy("createdAt", "asc")
    );
    const snapshot = await getDocs(q);
    const messages: Message[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];

    return { appointmentId, messages };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// ✅ Send a message
export const sendMessage = createAsyncThunk<
  { appointmentId: string; message: Message },
  { appointmentId: string; text: string; sender: string },
  { rejectValue: string }
>("messages/sendMessage", async ({ appointmentId, text, sender }, { rejectWithValue }) => {
  try {
    const newMessage: Message = {
      text,
      sender,
      createdAt: Timestamp.now(),
      appointmentId,
    };

    const docRef = await addDoc(
      collection(db, "appointments", appointmentId, "messages"),
      newMessage
    );

    return { appointmentId, message: { ...newMessage, id: docRef.id } };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// ✅ Slice
const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearMessages: (state, action: PayloadAction<string>) => {
      state.messages[action.payload] = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages[action.payload.appointmentId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch messages";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { appointmentId, message } = action.payload;
        if (!state.messages[appointmentId]) {
          state.messages[appointmentId] = [];
        }
        state.messages[appointmentId].push(message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload || "Failed to send message";
      });
  },
});

// Selectors
export const selectMessages = (state: RootState, appointmentId: string) =>
  state.messages.messages[appointmentId] || [];

export const selectMessageLoading = (state: RootState) => state.messages.loading;
export const selectMessageError = (state: RootState) => state.messages.error;

export const { clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
