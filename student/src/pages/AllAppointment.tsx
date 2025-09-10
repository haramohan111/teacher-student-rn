// src/pages/Student/AllAppointments.tsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../../../teacher/firebase";
import { collection, query, where, getDocs, doc, getDoc, DocumentData } from "firebase/firestore";
import "../styles/AllAppointments.css";

interface Appointment {
  id: string;
  teacherId: string;
  teacherName?: string;
  date: string;
  time: string;
  status: string;
}

const AllAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    const studentId = auth.currentUser?.uid;

    if (!studentId) {
      setError("You must be logged in to view appointments.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(collection(db, "appointments"), where("studentId", "==", studentId));
      const snapshot = await getDocs(q);

      const data: Appointment[] = await Promise.all(
        snapshot.docs.map(async (d: DocumentData) => {
          const appt = { id: d.id, ...d.data() } as Appointment;

console.log("Appointment Data:", appt);

          // Fetch teacher name
if (appt.teacherId) {
  try {
    const q = query(
      collection(db, "teachers"),
      where("uid", "==", appt.teacherId) // match by uid field
    );
    const teacherSnap = await getDocs(q);

    if (!teacherSnap.empty) {
      appt.teacherName = teacherSnap.docs[0].data().name || "Unnamed Teacher";
    } else {
      console.warn("No teacher found for UID:", appt.teacherId);
      appt.teacherName = "Unknown Teacher";
    }
  } catch (err) {
    console.error("Error fetching teacher:", err);
    appt.teacherName = "Unknown Teacher";
  }
}

          return appt;
        })
      );

      setAppointments(data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return <p className="no-results">Loading appointments...</p>;
  if (error) return <p className="no-results error">{error}</p>;
  if (appointments.length === 0) return <p className="no-results">No appointments found.</p>;

  return (
    <div className="manage-teacher-container">
      <div className="header">
        <h2>My Appointments</h2>
      </div>

      <table className="teacher-table">
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id} className={`status-${appt.status.toLowerCase()}`}>
              <td>{appt.teacherName || appt.teacherId}</td>
              <td>{appt.date}</td>
              <td>{appt.time}</td>
              <td>
                <span className={`status-badge ${appt.status}`}>{appt.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllAppointments;
