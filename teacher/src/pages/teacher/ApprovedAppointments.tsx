// src/pages/Admin/ApprovedAppointments.tsx
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  DocumentData,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../../styles/ApprovedAppointments.css";

interface Appointment {
  id: string;
  studentId: string;
  teacherId: string;
  studentName?: string;
  teacherName?: string;
  date: string;
  time: string;
  status: string;
}

const ApprovedAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTeacherId, setCurrentTeacherId] = useState<string | null>(null);

  const auth = getAuth();

  // ✅ Track teacher login state properly
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged in teacher:", user);
        setCurrentTeacherId(user.uid);
      } else {
        setCurrentTeacherId(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // ✅ Fetch appointments when teacherId is available
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentTeacherId) return;
console.log("Fetching appointments for teacher:", currentTeacherId);
      try {
        setLoading(true);

        const q = query(
          collection(db, "appointments"),
          where("teacherId", "==", currentTeacherId),
          where("status", "in", ["pending", "approved"])
        );

        const snapshot = await getDocs(q);

        const data: Appointment[] = await Promise.all(
          snapshot.docs.map(async (d: DocumentData) => {
            const appt = { id: d.id, ...d.data() } as Appointment;

            // Fetch student name
            if (appt.studentId) {
              const studentDoc = await getDoc(doc(db, "users", appt.studentId));
              appt.studentName = studentDoc.exists()
                ? (studentDoc.data().name as string)
                : "Unknown Student";
            }

            return appt;
          })
        );

        setAppointments(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentTeacherId]);

  // ✅ Approve appointment
  const handleApprove = async (id: string) => {
    try {
      const apptRef = doc(db, "appointments", id);
      await updateDoc(apptRef, { status: "approved" });

      // Update local state instead of removing (so it shows ✅)
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: "approved" } : appt
        )
      );

      alert("Appointment approved ✅");
    } catch (err: any) {
      alert("Failed to approve appointment: " + err.message);
    }
  };

  if (!currentTeacherId) return <p>Loading teacher info...</p>;
  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="approved-appointments">
      <h2>My Appointments (Pending & Approved)</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status / Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.studentName || appt.studentId}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>
                  {appt.status === "pending" ? (
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(appt.id)}
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="approved-label">✅ Approved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApprovedAppointments;
