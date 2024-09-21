import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import FeaturesPage from './Pages/FeaturesPage';
import Navbar from './CustomNavbar';

function Front() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
      </Routes>
    </>
  );
}

export default Front;
