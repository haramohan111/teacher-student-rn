import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard1';

import Home from './components/Home';
import AppointmentPage from './pages/AppointmentPage';
import StudentAuth from './pages/Login/Login';
import ProtectedRoute from './ProtectedRoute';
import ManageTeacher from './pages/Teacher/ManageTeacher';
import ScheduleAppointment from './pages/ScheduleAppointment';
import AllAppointments from './pages/AllAppointment';


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/student-login" element={<StudentAuth />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/student" element={<Home />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="appointment" element={<ScheduleAppointment />} />
                <Route path="livechat" element={<AppointmentPage />} />
              <Route path="manageteacher" element={<ManageTeacher />} />
              <Route path="appointment" element={<ScheduleAppointment />} />
                  <Route path="allappointment" element={<AllAppointments />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

          </Route>
          {/* Optional: 404 page */}
          <Route path="/" element={<Navigate to="/student-login" replace />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
