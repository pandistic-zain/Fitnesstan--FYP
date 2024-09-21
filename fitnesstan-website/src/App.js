import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Components/Pages/HomePage';
import FeaturesPage from './Components/Pages/FeaturesPage';
import Navbar from './Components/Navbar';

function App() {
  return (
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
