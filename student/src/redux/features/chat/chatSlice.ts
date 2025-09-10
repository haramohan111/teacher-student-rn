// src/redux/features/chat/chatSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../../../firebase';
import { collection, addDoc, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';

export interface Message {
  id?: string;
  text: string;
  sender: string;
  createdAt: any;
}

interface ChatState {
  messages: Message[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  status: 'idle',
  error: null,
};

// Fetch all messages
export const fetchMessages = createAsyncThunk<Message[], void, { rejectValue: string }>(
  'chat/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      const messages: Message[] = [];
      snapshot.forEach(doc => {
        messages.push({ id: doc.id, ...(doc.data() as Message) });
      });
      return messages;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Send a message
export const sendMessage = createAsyncThunk<Message, { text: string; sender: string }, { rejectValue: string }>(
  'chat/sendMessage',
  async ({ text, sender }, { rejectWithValue }) => {
    try {
      const messagesRef = collection(db, 'messages');
      const docRef = await addDoc(messagesRef, {
        text,
        sender,
        createdAt: Timestamp.now(),
      });
      return { id: docRef.id, text, sender, createdAt: Timestamp.now() };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearMessages: state => {
      state.messages = [];
    },
  },
  extraReducers: builder => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to fetch messages';
      })

      // Send message
      .addCase(sendMessage.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to send message';
      });
  },
});

export const { clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
