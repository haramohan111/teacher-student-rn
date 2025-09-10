// src/pages/Login/SignupLogin.tsx
import React, { useState } from 'react';
import { auth } from '../../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import axios from 'axios';

const SignupLogin: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const signup = async () => {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken: string = await userCredential.user.getIdToken();
      alert('Signup successful');

      await axios.post('http://localhost:5000/verify', {}, {
        headers: { Authorization: `Bearer ${idToken}` },
        withCredentials: true
      });
    } catch (err: any) {
      alert(err.message || 'Signup failed');
    }
  };

  const login = async () => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken: string = await userCredential.user.getIdToken();
      alert('Login successful');

      await axios.post('http://localhost:5000/verify', {}, {
        headers: { Authorization: `Bearer ${idToken}` },
        withCredentials: true
      });
    } catch (err: any) {
      alert(err.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Signup / Login</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={e => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={e => setPassword(e.target.value)} 
      />
      <br />
      <button onClick={signup}>Signup</button>
      <button onClick={login}>Login</button>
    </div>
  );
};

export default SignupLogin;
