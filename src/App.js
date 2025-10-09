import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
// import PathologyServices from './pages/Landing';
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
import ViewPackagePage from './pages/ViewPackage';
import StaffManagementPage from './pages/Staff';
import ReportsDashboard from './pages/Statistics';
import SettingsPage from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProtectedRoute({ children }) {
  const userEmail =
    localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
  const location = useLocation();

  useEffect(() => {
    if (!userEmail) {
      toast.warn("Please log in to access this page.");
    }
  }, [userEmail]);

  if (!userEmail) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

function AppRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

  if (userEmail && location.pathname === "/") {
    return <Navigate to="/patient-form" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<PathologyLogin />} />
      <Route path='/login' element={<PathologyLogin />} />
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path='/patient-form' element={<ProtectedRoute><PatientTestForm /></ProtectedRoute>} />
      <Route path='/patients' element={<ProtectedRoute><PatientTestManager /></ProtectedRoute>} />
      <Route path='/test-result/:patientId/:testId' element={<ProtectedRoute><EnterTestResult /></ProtectedRoute>} />
      <Route path='/inventory' element={<ProtectedRoute><PathologyStockControl /></ProtectedRoute>} />
      <Route path='/tests' element={<ProtectedRoute><Tests /></ProtectedRoute>} />
      <Route path='/add-test' element={<ProtectedRoute><AddTestPage /></ProtectedRoute>} />
      <Route path='/edit-test/:id' element={<ProtectedRoute><EditTestPage /></ProtectedRoute>} />
      <Route path='/view-test/:id' element={<ProtectedRoute><ViewTestPage /></ProtectedRoute>} />
      <Route path='/view-package/:id' element={<ProtectedRoute><ViewPackagePage /></ProtectedRoute>} />
      <Route path='/staff' element={<ProtectedRoute><StaffManagementPage /></ProtectedRoute>} />
      <Route path='/reports' element={<ProtectedRoute><ReportsDashboard /></ProtectedRoute>} />
      <Route path='/settings' element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
    </Routes>
  )
}
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRouter />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick />
      </BrowserRouter>
    </div>
  );
}

export default App;
