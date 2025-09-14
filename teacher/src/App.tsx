import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AdminLogin from './pages/Login/AdminLogin';
import SignupLogin from './pages/Login/SignupLogin';
// import ScheduleAppointment from './pagesScheduleAppointment';
import ManageTeacher from './pages/teacher/ManageTeacher';
import ApprovedAppointments from './pages/teacher/ApprovedAppointments';


function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/teacherlogin" element={<AdminLogin />} />
        <Route path="/teacher/signup-login" element={<SignupLogin />} />
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/teacher" element={<Home />}>
            <Route path="dashboard" element={<Dashboard />} />
             {/* <Route path="appointment" element={<ScheduleAppointment />} /> */}
             <Route path="manageteacher" element={<ManageTeacher />} />
             <Route path="app-appointment" element={<ApprovedAppointments />} />
            {/* <Route path="user/add-user" element={<AddUser />} />
            <Route path="user/manage-users" element={<ManageUsers />} />
            <Route path="user/edit-user/:uid" element={<EditUser />} />
            <Route path="plans/add-plans" element={<AddPlans />} />
            <Route path="music/manage-music" element={<ManageMusic />} /> */}
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

        {/* </Route> */}
        {/* Optional: 404 page */}
        <Route path="/" element={<Navigate to="/teacherlogin" replace />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
