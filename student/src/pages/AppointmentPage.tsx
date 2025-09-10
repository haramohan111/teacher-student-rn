// AppointmentPage.tsx
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import Chat from './Chat';

const AppointmentPage: React.FC = () => {
  const [user] = useAuthState(auth);

  if (!user) return <p>Please log in to chat</p>;

  return (
    <div>
      <h2>Book Appointment & Chat</h2>
      {/* Appointment booking form can go here */}
      
      <Chat  user={user} />
    </div>
  );
};

export default AppointmentPage;
