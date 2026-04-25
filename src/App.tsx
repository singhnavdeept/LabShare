import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EquipmentList from './pages/EquipmentList';
import RequestForm from './pages/RequestForm';
import MyBookings from './pages/MyBookings';
import UsageLogs from './pages/UsageLogs';
import Approvals from './pages/Approvals';

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)]">
        {children}
      </div>
    </>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/equipment" element={<PrivateRoute><EquipmentList /></PrivateRoute>} />
            <Route path="/request/:id" element={<PrivateRoute><RequestForm /></PrivateRoute>} />
            <Route path="/bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
            <Route path="/logs" element={<PrivateRoute><UsageLogs /></PrivateRoute>} />
            <Route path="/approvals" element={<PrivateRoute><Approvals /></PrivateRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
