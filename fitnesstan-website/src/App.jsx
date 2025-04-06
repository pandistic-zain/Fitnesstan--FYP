import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Front from './Components/Front';
import Register from './Components/Pages/Register';
import EmailVerification from './Components/Pages/EmailVerification';
import AdditionalInfoForm from './Components/Pages/AdditionalInfoForm';
import AdminDashboard from './Components/AdminPanel/AdminDashboard';
import UserManagement from './Components/AdminPanel/UserManagement';
import UserDashboard from './Components/UserPanel/UserDashboard';
import ExercisePage from './Components/UserPanel/ExercisePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Front />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/AdditionalInfoForm" element={<AdditionalInfoForm />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/ExercisePage" element={<ExercisePage />} />
      </Routes>
    </Router>
  );
}

export default App;
