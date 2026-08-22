import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateJD from './pages/CreateJD';
import UploadResumes from './pages/UploadResumes';
import Screening from './pages/Screening';
import Shortlisted from './pages/Shortlisted';

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, paddingBottom: '48px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jd" element={<CreateJD />} />
            <Route path="/upload/:jd_id" element={<UploadResumes />} />
            <Route path="/screening/:jd_id" element={<Screening />} />
            <Route path="/shortlisted/:jd_id" element={<Shortlisted />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
