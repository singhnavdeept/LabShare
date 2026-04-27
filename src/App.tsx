import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import FloatingActionMenu from './components/FloatingActionMenu';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EquipmentList from './pages/EquipmentList';
import RequestForm from './pages/RequestForm';
import MyBookings from './pages/MyBookings';
import UsageLogs from './pages/UsageLogs';
import Approvals from './pages/Approvals';

const queryClient = new QueryClient();

const SocketNotification = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    const socket = io(window.location.origin);
    
    socket.emit('join', user.id);
    
    socket.on('notification', (data) => {
      if (data.type === 'success') {
        toast.success(data.title, { description: data.message });
      } else if (data.type === 'error') {
        toast.error(data.title, { description: data.message });
      } else {
        toast.info(data.title, { description: data.message });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return null;
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] overflow-x-hidden">
        {children}
      </div>
      <FloatingActionMenu />
      <SocketNotification />
    </>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><PageTransition><Dashboard /></PageTransition></PrivateRoute>} />
        <Route path="/equipment" element={<PrivateRoute><PageTransition><EquipmentList /></PageTransition></PrivateRoute>} />
        <Route path="/request/:id" element={<PrivateRoute><PageTransition><RequestForm /></PageTransition></PrivateRoute>} />
        <Route path="/bookings" element={<PrivateRoute><PageTransition><MyBookings /></PageTransition></PrivateRoute>} />
        <Route path="/logs" element={<PrivateRoute><PageTransition><UsageLogs /></PageTransition></PrivateRoute>} />
        <Route path="/approvals" element={<PrivateRoute><PageTransition><Approvals /></PageTransition></PrivateRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster theme="dark" position="top-right" richColors />
          <AnimatedRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
