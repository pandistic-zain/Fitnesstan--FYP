import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Components/Pages/HomePage';
import Register from './Components/Pages/Register';
import FeaturesPage from './Components/Pages/FeaturesPage';
import Navbar from './Components/NavBar';

function App() {
  return (
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
