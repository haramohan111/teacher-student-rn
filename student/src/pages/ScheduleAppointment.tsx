// src/pages/Student/ScheduleAppointment.tsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../../../teacher/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import "../styles/ScheduleAppointment.css";

interface Teacher {
  id: string;
  name: string;
  email: string;
  uid: string;
}

const ScheduleAppointment: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherId, setTeacherId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  console.log("teachers:", teachers);
  // Fetch teachers list
useEffect(() => {
  const fetchTeachers = async () => {
    const snapshot = await getDocs(collection(db, "teachers"));
    const teacherList: Teacher[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Teacher, "id">;
      return { id: doc.id, ...data };
    });
    setTeachers(teacherList);
  };
  fetchTeachers();
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const studentId = auth.currentUser?.uid;

    if (!studentId) {
      alert("You must be logged in to schedule an appointment");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        studentId,
        teacherId,
        date,
        time,
        status: "pending",
        createdAt: new Date(),
      });
      alert("Appointment scheduled successfully!");
      setTeacherId("");
      setDate("");
      setTime("");
    } catch (err: any) {
      console.error(err);
      alert("Failed to schedule appointment: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Schedule Appointment</h2>
      <form onSubmit={handleSubmit}>
        {/* Select Teacher */}
        <label>Choose Teacher:</label>
        <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required>
          <option value="">-- Select Teacher --</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.uid}>
              {t.name} ({t.email})
            </option>
          ))}
        </select>

        {/* Date */}
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {/* Time */}
        <label>Time:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        <button type="submit">Schedule</button>
      </form>
    </div>
  );
};

export default ScheduleAppointment;
