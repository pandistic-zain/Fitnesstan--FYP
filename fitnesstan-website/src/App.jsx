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
import DietPage from './Components/UserPanel/DietPage';
import ChangePassword from './Components/UserPanel/ChangePassword';
import ReSubmitData from './Components/Pages/ReSubmitData';
import ForgetPassword from './Components/Pages/ForgetPassword';
import ResetPassword from './Components/Pages/ResetPassword';

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
        <Route path="/DietPage" element={<DietPage />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route path="/ReSubmitData" element={<ReSubmitData />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
