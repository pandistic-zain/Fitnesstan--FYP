import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import FeaturesPage from './Pages/FeaturesPage';
import Navbar from './CustomNavbar';
import Footer from './Footer';

function Front() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/features" element={<FeaturesPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default Front;
