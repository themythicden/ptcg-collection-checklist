import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import ChecklistPage from './ChecklistPage';
import './index.css';
import PrintableList from './PrintableList';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/set/:setName" element={<ChecklistPage />} />
        <Route path="/print/:setName" element={<PrintPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
