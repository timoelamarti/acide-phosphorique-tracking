// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SimulationPage from './pages/SimulationPage';
import AlertsPage from './pages/AlertsPage';
import AnalysisPage from './pages/AnalysisPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h2>ACP Manager</h2>
          </div>
          
          <ul className="sidebar-menu">
            <li className="menu-item">
              <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="menu-icon dashboard-icon"></i>
                <span>Tableau de bord</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/simulation" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="menu-icon simulation-icon"></i>
                <span>Simulation</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/alerts" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="menu-icon alerts-icon"></i>
                <span>Alertes</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/analysis" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="menu-icon analysis-icon"></i>
                <span>Analyse</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="menu-icon profile-icon"></i>
                <span>Profil</span>
              </NavLink>
            </li>
          </ul>
          
          <div className="sidebar-footer">
            <div className="status-indicator online">
              <span className="status-dot"></span>
              <span className="status-text">Connecté</span>
            </div>
            <div className="version-info">v1.0.0</div>
          </div>
        </nav>
        
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;