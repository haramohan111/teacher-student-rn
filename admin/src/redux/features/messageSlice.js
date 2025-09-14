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
import { db } from "../../../firebase";
import { collection, addDoc, query, orderBy, getDocs, Timestamp, } from "firebase/firestore";
const initialState = {
    messages: {},
    loading: false,
    error: null,
};
// ✅ Fetch messages for an appointment
export const fetchMessages = createAsyncThunk("messages/fetchMessages", (appointmentId_1, _a) => __awaiter(void 0, [appointmentId_1, _a], void 0, function* (appointmentId, { rejectWithValue }) {
    try {
        const q = query(collection(db, "appointments", appointmentId, "messages"), orderBy("createdAt", "asc"));
        const snapshot = yield getDocs(q);
        const messages = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        return { appointmentId, messages };
    }
    catch (error) {
        return rejectWithValue(error.message);
    }
}));
// ✅ Send a message
export const sendMessage = createAsyncThunk("messages/sendMessage", (_a, _b) => __awaiter(void 0, [_a, _b], void 0, function* ({ appointmentId, text, sender }, { rejectWithValue }) {
    try {
        const newMessage = {
            text,
            sender,
            createdAt: Timestamp.now(),
            appointmentId,
        };
        const docRef = yield addDoc(collection(db, "appointments", appointmentId, "messages"), newMessage);
        return { appointmentId, message: Object.assign(Object.assign({}, newMessage), { id: docRef.id }) };
    }
    catch (error) {
        return rejectWithValue(error.message);
    }
}));
// ✅ Slice
const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        clearMessages: (state, action) => {
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
export const selectMessages = (state, appointmentId) => state.messages.messages[appointmentId] || [];
export const selectMessageLoading = (state) => state.messages.loading;
export const selectMessageError = (state) => state.messages.error;
export const { clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
