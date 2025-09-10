// firebase.ts
import admin from "firebase-admin";
import serviceAccount from "./firebaseServiceKey.json"; // works if "resolveJsonModule": true in tsconfig.json

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://teacher-student-b71ee-default-rtdb.firebaseio.com",
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
