import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Front from './Components/Front';
import Register from './Components/Pages/Register';
import AdminDashboard from './Components/AdminPanel/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Front />} />
        <Route path="/register" element={<Register />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
