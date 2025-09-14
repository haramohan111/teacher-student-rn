// src/redux/features/student/studentSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../../firebase";
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";

export interface Student {
  id: number;
  uid: string; // Firebase UID
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  lastLogin?: string;
  verified: boolean;
}

interface StudentState {
  students: Student[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StudentState = {
  students: [],
  status: "idle",
  error: null,
};

// ✅ Fetch Students
export const fetchStudents = createAsyncThunk("students/fetchStudents", async () => {
  const snapshot = await getDocs(collection(db, "users"));
  const students: Student[] = snapshot.docs.map((docSnap, index) => ({
    id: index + 1,
    uid: docSnap.id,
    ...docSnap.data(),
    verified: docSnap.data().verified ?? false,
  })) as Student[];
  return students;
});

// ✅ Add Student
export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (studentData: Omit<Student, "id" | "uid">) => {
    // Save to Firestore
    const docRef = await addDoc(collection(db, "users"), {
      ...studentData,
      verified: studentData.verified ?? false,
    });

    // Return student with generated Firestore UID
    return {
      ...studentData,
      uid: docRef.id,
      id: Date.now(), // temporary unique ID for table display
    } as Student;
  }
);

// ✅ Toggle Verified
export const toggleVerified = createAsyncThunk(
  "students/toggleVerified",
  async ({ uid, verified }: { uid: string; verified: boolean }) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { verified });
    return { uid, verified };
  }
);

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
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch students";
      })

      // Add Student
      .addCase(addStudent.fulfilled, (state, action: PayloadAction<Student>) => {
        state.students.push(action.payload);
      })

      // Toggle Verified
      .addCase(
        toggleVerified.fulfilled,
        (state, action: PayloadAction<{ uid: string; verified: boolean }>) => {
          const student = state.students.find((s) => s.uid === action.payload.uid);
          if (student) {
            student.verified = action.payload.verified;
          }
        }
      );
  },
});

export default studentSlice.reducer;
