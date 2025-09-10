import { useEffect } from "react";
import { auth, firestore } from "../../firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const CreateAdmin = () => {
  useEffect(() => {
    const insertDummyAdmin = async () => {
      try {
        const email = "admin@gmail.com";
        const password = "123123";

        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // 2. Store user document with just "role"
        await setDoc(doc(firestore, "users", uid), {
          email,
          role: "admin",   // only store role name
        });

        alert("Dummy Admin Created with role: admin");
      } catch (error) {
        console.error(error);
        alert("Failed to create admin");
      }
    };

    insertDummyAdmin();
  }, []);

  return <h1>Inserting Dummy Admin...</h1>;
};

export default CreateAdmin;
