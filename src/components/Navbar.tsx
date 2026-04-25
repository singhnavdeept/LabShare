import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Microscope, LayoutDashboard, CalendarClock } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-30 shadow-sm text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center hover:scale-105 transition-transform cursor-pointer">
              <Microscope className="h-8 w-8 text-violet-500" />
              <span className="ml-2 text-xl font-bold text-white tracking-tight">LabShare</span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-violet-500 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link to="/equipment" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-violet-500 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                <Microscope className="w-4 h-4 mr-2" />
                Equipment
              </Link>
              {user.role === 'researcher' && (
                <Link to="/bookings" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-violet-500 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                  <CalendarClock className="w-4 h-4 mr-2" />
                  My Bookings
                </Link>
              )}
              {user.role !== 'researcher' && (
                <>
                  <Link to="/approvals" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-violet-500 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                    <CalendarClock className="w-4 h-4 mr-2" />
                    Approvals
                  </Link>
                  <Link to="/logs" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-violet-500 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                    <CalendarClock className="w-4 h-4 mr-2" />
                    Usage Logs
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="mr-4 text-sm text-right hidden sm:block">
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-violet-300 text-xs capitalize">{user.role} • {user.department}</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
