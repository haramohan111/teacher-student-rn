var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, doc, getDoc, } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/AdminChat.css";
const AdminChat = () => {
    var _a;
    const auth = getAuth();
    const admin = auth.currentUser;
    if (!admin)
        return _jsx("p", { children: "Loading..." }); // Or redirect to login
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Loader state
    const messagesEndRef = useRef(null); // ✅ Ref for scroll
    // fetch user profile by UID
    const fetchUserDetails = (uid) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = yield getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                return {
                    name: data.displayName || data.name || "Unknown",
                    email: data.email || "",
                };
            }
            return { name: "Unknown", email: "" };
        }
        catch (err) {
            console.error("Error fetching user details:", err);
            return { name: "Unknown", email: "" };
        }
    });
    // Load student list (unique senders from messages)
    useEffect(() => {
        const msgsRef = collection(db, "messages");
        const unsubscribe = onSnapshot(msgsRef, (snapshot) => __awaiter(void 0, void 0, void 0, function* () {
            const uids = new Set();
            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (data.sender !== (admin === null || admin === void 0 ? void 0 : admin.uid)) {
                    uids.add(data.sender);
                }
            });
            const users = [];
            for (const uid of uids) {
                const details = yield fetchUserDetails(uid);
                users.push({ uid, name: details.name });
            }
            setStudents(users);
        }));
        return () => unsubscribe();
    }, [admin === null || admin === void 0 ? void 0 : admin.uid]);
    // Load messages for selected student
    useEffect(() => {
        if (!selectedStudent)
            return;
        const msgsRef = collection(db, "messages");
        const q = query(msgsRef, orderBy("createdAt", "asc"));
        setLoading(true); // ✅ show loader while fetching
        const unsubscribe = onSnapshot(q, (snapshot) => __awaiter(void 0, void 0, void 0, function* () {
            const msgs = [];
            for (const docSnap of snapshot.docs) {
                const data = docSnap.data();
                // ✅ Student messages
                if (data.sender === selectedStudent &&
                    (!data.recipient || data.recipient === (admin === null || admin === void 0 ? void 0 : admin.uid))) {
                    const { name, email } = yield fetchUserDetails(data.sender);
                    msgs.push(Object.assign(Object.assign({ id: docSnap.id }, data), { senderName: name, senderEmail: email }));
                }
                // ✅ Admin messages
                if (data.sender === (admin === null || admin === void 0 ? void 0 : admin.uid) && data.recipient === selectedStudent) {
                    const { name, email } = yield fetchUserDetails(data.sender);
                    msgs.push(Object.assign(Object.assign({ id: docSnap.id }, data), { senderName: name, senderEmail: email }));
                }
            }
            setMessages(msgs);
            setLoading(false); // ✅ stop loader
        }));
        return () => unsubscribe();
    }, [selectedStudent, admin === null || admin === void 0 ? void 0 : admin.uid]);
    // ✅ Auto-scroll when messages update
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    // Send reply as admin.uid
    const sendReply = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!selectedStudent || !input.trim())
            return;
        const msgsRef = collection(db, "messages");
        yield addDoc(msgsRef, {
            text: input,
            sender: admin === null || admin === void 0 ? void 0 : admin.uid,
            recipient: selectedStudent,
            createdAt: Timestamp.now(),
        });
        setInput("");
    });
    return (_jsxs("div", { className: "admin-chat", children: [_jsxs("div", { className: "chat-sidebar", children: [_jsx("h3", { children: "Students" }), students.map((s) => (_jsx("div", { className: `student-item ${s.uid === selectedStudent ? "active" : ""}`, onClick: () => setSelectedStudent(s.uid), children: s.name }, s.uid)))] }), _jsxs("div", { className: "chat-window", children: [_jsxs("div", { className: "chat-header", children: ["Chat with", " ", ((_a = students.find((s) => s.uid === selectedStudent)) === null || _a === void 0 ? void 0 : _a.name) ||
                                "Select a student"] }), _jsx("div", { className: "chat-messages", children: loading ? (_jsx("div", { className: "chat-loader", children: "Loading messages..." })) : (_jsxs(_Fragment, { children: [messages.map((msg) => (_jsxs("div", { className: `message ${msg.sender === (admin === null || admin === void 0 ? void 0 : admin.uid) ? "admin" : "student"}`, children: [_jsxs("b", { children: [msg.sender === (admin === null || admin === void 0 ? void 0 : admin.uid) ? "Admin" : msg.senderName, ":"] }), " ", msg.text] }, msg === null || msg === void 0 ? void 0 : msg.id))), _jsx("div", { ref: messagesEndRef })] })) }), selectedStudent && (_jsxs("div", { className: "chat-input", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type reply...", onKeyDown: (e) => e.key === "Enter" && sendReply() }), _jsx("button", { onClick: sendReply, children: "Send" })] }))] })] }));
};
export default AdminChat;
