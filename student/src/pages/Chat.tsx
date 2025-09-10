// Chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import '../styles/Chat.css';

interface ChatProps {
  user: User;
}

interface Message {
  id?: string;
  text: string;
  sender: string;
  recipient?: string;
  senderName: string;
  createdAt: any;
}

const Chat: React.FC<ChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // 👈 new state
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Listen for real-time messages
  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs: Message[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Message;

        if (data.sender === user?.uid || data.recipient === user?.uid) {
          const senderName = await fetchUserName(data.sender);
          msgs.push({ id: docSnap.id, ...data, senderName });
        }
      }

      setMessages(msgs);
      setLoading(false); // 👈 stop loading once messages fetched
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, {
        text: input,
        sender: user?.uid,
        recipient: "", // 👈 add recipient if you implement private chat
        createdAt: Timestamp.now(),
      });
      setInput('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Send on Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  // Fetch user name from Firestore
  const fetchUserName = async (uid: string): Promise<string> => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data().name || userSnap.data().email || uid;
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
    return uid; // fallback
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">Live Chat</div>

      <div className="chat-messages">
        {loading ? ( // 👈 loading spinner or text
          <p className="loading-text">Loading messages...</p>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`message ${msg?.sender === user?.uid ? 'sent' : 'received'}`}
            >
              <span className="message-text">{msg.text}</span>
              <span className="message-sender">
                {msg.sender === user?.uid ? 'You' : msg.senderName}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
