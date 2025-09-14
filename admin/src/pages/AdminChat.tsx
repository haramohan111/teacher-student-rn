import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { User, getAuth } from "firebase/auth";
import "../styles/AdminChat.css";

interface Message {
  id?: string;
  text: string;
  sender: string;
  createdAt: any;
  senderName?: string;
  senderEmail?: string;
  recipient:string
}

interface AdminChatProps {
  admin: User; // logged-in admin
}

const AdminChat: React.FC = () => {
  const auth = getAuth();
  const admin = auth.currentUser;

  if (!admin) return <p>Loading...</p>; // Or redirect to login
  const [students, setStudents] = useState<{ uid: string; name: string }[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loader state

  const messagesEndRef = useRef<HTMLDivElement | null>(null); // ✅ Ref for scroll

  // fetch user profile by UID
  const fetchUserDetails = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          name: data.displayName || data.name || "Unknown",
          email: data.email || "",
        };
      }
      return { name: "Unknown", email: "" };
    } catch (err) {
      console.error("Error fetching user details:", err);
      return { name: "Unknown", email: "" };
    }
  };

  // Load student list (unique senders from messages)
  useEffect(() => {
    const msgsRef = collection(db, "messages");
    const unsubscribe = onSnapshot(msgsRef, async (snapshot) => {
      const uids = new Set<string>();
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Message;
        if (data.sender !== admin?.uid) {
          uids.add(data.sender);
        }
      });

      const users: { uid: string; name: string }[] = [];
      for (const uid of uids) {
        const details = await fetchUserDetails(uid);
        users.push({ uid, name: details.name });
      }
      setStudents(users);
    });

    return () => unsubscribe();
  }, [admin?.uid]);

  // Load messages for selected student
  useEffect(() => {
    if (!selectedStudent) return;

    const msgsRef = collection(db, "messages");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    setLoading(true); // ✅ show loader while fetching

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs: Message[] = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Message;

        // ✅ Student messages
        if (
          data.sender === selectedStudent &&
          (!data.recipient || data.recipient === admin?.uid)
        ) {
          const { name, email } = await fetchUserDetails(data.sender);
          msgs.push({
            id: docSnap.id,
            ...data,
            senderName: name,
            senderEmail: email,
          });
        }

        // ✅ Admin messages
        if (data.sender === admin?.uid && data.recipient === selectedStudent) {
          const { name, email } = await fetchUserDetails(data.sender);
          msgs.push({
            id: docSnap.id,
            ...data,
            senderName: name,
            senderEmail: email,
          });
        }
      }
      setMessages(msgs);
      setLoading(false); // ✅ stop loader
    });

    return () => unsubscribe();
  }, [selectedStudent, admin?.uid]);

  // ✅ Auto-scroll when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send reply as admin.uid
  const sendReply = async () => {
    if (!selectedStudent || !input.trim()) return;
    const msgsRef = collection(db, "messages");
    await addDoc(msgsRef, {
      text: input,
      sender: admin?.uid,
      recipient: selectedStudent,
      createdAt: Timestamp.now(),
    });
    setInput("");
  };

  return (
    <div className="admin-chat">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <h3>Students</h3>
        {students.map((s) => (
          <div
            key={s.uid}
            className={`student-item ${
              s.uid === selectedStudent ? "active" : ""
            }`}
            onClick={() => setSelectedStudent(s.uid)}
          >
            {s.name}
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div className="chat-window">
        <div className="chat-header">
          Chat with{" "}
          {students.find((s) => s.uid === selectedStudent)?.name ||
            "Select a student"}
        </div>
        <div className="chat-messages">
          {loading ? (
            <div className="chat-loader">Loading messages...</div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg?.id}
                  className={`message ${
                    msg.sender === admin?.uid ? "admin" : "student"
                  }`}
                >
                  <b>{msg.sender === admin?.uid ? "Admin" : msg.senderName}:</b>{" "}
                  {msg.text}
                </div>
              ))}
              {/* ✅ Invisible div to scroll into view */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        {selectedStudent && (
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type reply..."
              onKeyDown={(e) => e.key === "Enter" && sendReply()}
            />
            <button onClick={sendReply}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
