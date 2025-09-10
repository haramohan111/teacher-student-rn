// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Student pages
import AddStudent from './pages/Student/AddStudent';
import ManageStudents from './pages/Student/ManageStudents';
import EditStudent from './pages/Student/EditStudent';

// Teacher pages
import AddTeacher from './pages/Teacher/AddTeacher';
import ManageTeacher from './pages/Teacher/ManageTeacher';


// Common pages
import Home from './components/Home';
import Dashboard1 from './components/Dashboard1';
import AdminLogin from './pages/Login/AdminLogin';
import SignupLogin from './pages/Login/SignupLogin';
import ProtectedRoute from './ProtectedRoute'; // Uncomment when you implement
import CreateAdmin from './components/CreateAdmin';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminChat from './pages/AdminChat';
import EditTeacher from './pages/Teacher/EditTeacher';

function App() {
  return (
    <>     
    <ToastContainer position="top-right" autoClose={3000} />
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admin/signup-login" element={<SignupLogin />} />

        {/* Protected admin panel */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<Home />}>
            <Route path="dashboard" element={<Dashboard1 />} />

            {/* Student routes */}
            <Route path="student/add-student" element={<AddStudent />} />
            <Route path="student/manage-students" element={<ManageStudents />} />
            <Route path="student/edit/:sid" element={<EditStudent />} />
            <Route path='teacher/edit/:id' element={<EditTeacher/>}/>
            <Route path="messages" element={<AdminChat />} />
            {/* Teacher routes */}
            <Route path="teacher/add-teacher" element={<AddTeacher />} />
            <Route path="teacher/manage-teachers" element={<ManageTeacher />} />

            {/* Default redirect inside /admin */}
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>
        <Route path="dd" element={<CreateAdmin />} />
        {/* Default redirect to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* 404 fallback */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
