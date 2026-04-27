import React, { useState } from 'react';
import { Plus, Microscope, Beaker, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const canManage = user?.role === 'admin' || user?.role === 'manager';

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleAction = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  if (!user) return null;

  return (
    <div 
      className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-4 group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Menu Items */}
      <div className={`flex flex-col items-end space-y-3 mb-2 transition-all duration-300 origin-bottom ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8 pointer-events-none'}`}>
        {/* Request Equipment Option */}
        <div className="flex items-center group/item">
          <span className="mr-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">
            Request Equipment
          </span>
          <button
            onClick={() => handleAction('/equipment')}
            className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-full shadow-lg flex items-center justify-center text-violet-400 hover:text-white hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <Microscope className="w-5 h-5" />
          </button>
        </div>

        {/* Add Equipment Option (Only for admins/managers) */}
        {canManage && (
          <div className="flex items-center group/item">
            <span className="mr-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">
              Add Equipment
            </span>
            <button
              onClick={() => handleAction('/equipment?add=true')}
              className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-full shadow-lg flex items-center justify-center text-emerald-400 hover:text-white hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 relative z-10 ${
          isOpen ? 'bg-slate-700 hover:bg-slate-600 rotate-45' : 'bg-violet-600 hover:bg-violet-500 hover:scale-105 shadow-violet-900/50'
        }`}
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}
