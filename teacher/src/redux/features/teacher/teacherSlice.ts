import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { auth,db } from "../../../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { uploadImageToCloudinary } from "../../../utils/cloudinaryUpload";
import { deleteUser } from "firebase/auth";

// ---------------- Types ---------------- //
export interface Teacher {
  id?: string;
  name: string;
  email: string;
  classbatch:string;
  subject: string;
  phone?: string;
  joinDate?: string;
  profileImageUrl?: string;
  profilePublicId?: string;
  password:string;
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

const teachersCollection = collection(db, "teachers");

// ---------------- Async Thunks ---------------- //

// Fetch teachers
export const fetchTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await getDocs(teachersCollection);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Teacher[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);



// Fetch teacher by ID (Firestore)
export const fetchTeacherByIdAsync = createAsyncThunk(
  "teachers/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const teacherDoc = await getDoc(doc(db, "teachers", id));
      if (!teacherDoc.exists()) {
        throw new Error("Teacher not found");
      }

      const data = teacherDoc.data();

      return {
        id: teacherDoc.id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        classbatch:data.classbatch,
        phone: data.phone || "",
        joinDate: data.joinDate || "",
        profileImageUrl: data.profileImageUrl || "",  // Cloudinary URL
        profilePublicId: data.profilePublicId || "",  // Cloudinary public_id
      } as Teacher;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);



// Add teacher
export const addTeacherAsync = createAsyncThunk(
  "teachers/addTeacher",
  async (teacher: TeacherPayload, { rejectWithValue }) => {
    try {
      // Check email
      const emailQuery = await getDocs(
        query(teachersCollection, where("email", "==", teacher.email))
      );
      if (!emailQuery.empty) return rejectWithValue("Email already exists");

      // Check phone
      if (teacher.phone) {
        const phoneQuery = await getDocs(
          query(teachersCollection, where("phone", "==", teacher.phone))
        );
        if (!phoneQuery.empty) return rejectWithValue("Phone number already exists");
      }

      // Upload image
      let profileImageUrl = "";
      let profilePublicId = "";
      if (teacher.profileFile) {
        const result = await uploadImageToCloudinary(teacher.profileFile);
        profileImageUrl = result.secure_url;
        profilePublicId = result.public_id;
      }

      // Save to Firestore
      const docRef = await addDoc(teachersCollection, {
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        classbatch:teacher.classbatch,
        phone: teacher.phone || "",
        joinDate: teacher.joinDate || new Date().toISOString(),
        profileImageUrl,
        profilePublicId,
      });

      return {
        id: docRef.id,
        ...teacher,
        profileImageUrl,
        profilePublicId,
      } as Teacher;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Update teacher
export const updateTeacherAsync = createAsyncThunk(
  "teachers/updateTeacher",
  async (teacher: TeacherPayload, { rejectWithValue }) => {
    try {
      if (!teacher.id) throw new Error("Teacher ID is required");

      const teacherDoc = doc(db, "teachers", teacher.id);

      let profileImageUrl = teacher.profileImageUrl || "";
      let profilePublicId = teacher.profilePublicId || "";

      // New file uploaded → upload & replace
      if (teacher.profileFile) {
        const result = await uploadImageToCloudinary(teacher.profileFile);
        profileImageUrl = result.secure_url;
        profilePublicId = result.public_id;
      }

      const updatedData = {
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        classbatch:teacher.classbatch,
        phone: teacher.phone || "",
        joinDate: teacher.joinDate || new Date().toISOString(),
        profileImageUrl,
        profilePublicId,
      };

      await updateDoc(teacherDoc, updatedData);

      return { id: teacher.id, ...updatedData } as Teacher;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete teacher
export const deleteTeacherAsync = createAsyncThunk(
  "teachers/deleteTeacher",
  async (id: string, { rejectWithValue }) => {
    try {
      // 1️⃣ Get teacher document
      const teacherRef = doc(db, "teachers", id);
      const teacherSnap = await getDoc(teacherRef);

      if (!teacherSnap.exists()) {
        return rejectWithValue("Teacher not found");
      }

      const teacherData = teacherSnap.data();

      // 2️⃣ Delete teacher from Firestore
      await deleteDoc(teacherRef);

      // 3️⃣ Delete from Firebase Auth (if exists)
      if (teacherData.uid) {
        const user = auth.currentUser;
        if (user && user.uid === teacherData.uid) {
          await deleteUser(user);
        }
      }

      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
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
      })
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
