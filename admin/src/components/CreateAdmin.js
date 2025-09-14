var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { auth, firestore } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
const CreateAdmin = () => {
    useEffect(() => {
        const insertDummyAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const email = "admin@gmail.com";
                const password = "123123";
                // 1. Create user in Firebase Auth
                const userCredential = yield createUserWithEmailAndPassword(auth, email, password);
                const uid = userCredential.user.uid;
                // 2. Store user document with just "role"
                yield setDoc(doc(firestore, "users", uid), {
                    email,
                    role: "admin", // only store role name
                });
                alert("Dummy Admin Created with role: admin");
            }
            catch (error) {
                console.error(error);
                alert("Failed to create admin");
            }
        });
        insertDummyAdmin();
    }, []);
    return _jsx("h1", { children: "Inserting Dummy Admin..." });
};
export default CreateAdmin;
