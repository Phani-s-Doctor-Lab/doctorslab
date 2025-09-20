import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import PathologyServices from './pages/Landing';
import PathologyLogin from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientTestForm from './pages/PatientForm';
import PatientTestManager from './pages/Patients';
import EnterTestResult from './pages/TestResult';
import PathologyStockControl from './pages/Inventory';
import Tests from './pages/Tests';
import AddTestPage from './pages/AddTest';
import EditTestPage from './pages/EditTest';
import ViewTestPage from './pages/ViewTest';
import StaffManagementPage from './pages/Staff';
import ReportsDashboard from './pages/Statistics';
import SettingsPage from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';

function AppRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

  // Redirect logged-in user from "/" to "/dashboard"
  // but NOT from other routes
  if (userEmail && location.pathname === "/") {
    return <Navigate to="/patient-form" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<PathologyServices />} />
      <Route path='/login' element={<PathologyLogin />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/patient-form' element={<PatientTestForm />} />
      <Route path='/patients' element={<PatientTestManager />} />
      <Route path='/test-result/:patientId/:testId' element={<EnterTestResult />} />
      <Route path='/inventory' element={<PathologyStockControl />} />
      <Route path='/tests' element={<Tests />} />
      <Route path='/add-test' element={<AddTestPage />} />
      <Route path='/edit-test/:id' element={<EditTestPage />} />
      <Route path='/view-test/:id' element={<ViewTestPage />} />
      <Route path='/staff' element={<StaffManagementPage />} />
      <Route path='/reports' element={<ReportsDashboard />} />
      <Route path='/settings' element={<SettingsPage />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
    </Routes>
  )
}
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
