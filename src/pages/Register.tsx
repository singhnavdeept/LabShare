import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '', role: 'researcher' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-800/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-slate-700/50">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-tight">Create an account</h2>
        </div>
        {error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-xl border border-red-800/30">{error}</div>}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-300">Full Name</label>
            <input name="name" type="text" required onChange={handleChange} className="w-full px-4 py-3 border border-slate-700 bg-slate-900/50 text-white rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input name="email" type="email" required onChange={handleChange} className="w-full px-4 py-3 border border-slate-700 bg-slate-900/50 text-white rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative mt-1">
              <input name="password" type={showPassword ? "text" : "password"} required minLength={6} onChange={handleChange} className="w-full px-4 py-3 border border-slate-700 bg-slate-900/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Department</label>
            <input name="department" type="text" required onChange={handleChange} placeholder="e.g. Biology" className="w-full px-4 py-3 border border-slate-700 bg-slate-900/50 placeholder-slate-500 text-white rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 border border-slate-700 bg-slate-900/50 text-white rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all">
              <option value="researcher">Researcher</option>
              <option value="manager">Department Manager</option>
              <option value="admin">System Admin</option>
            </select>
            <p className="text-xs text-slate-400 mt-2">Note: Role selection is open for demo purposes.</p>
          </div>
          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md hover:shadow-lg shadow-violet-900/50 text-white bg-violet-600 hover:bg-violet-500 font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all cursor-pointer disabled:opacity-50">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          <div className="text-sm text-center">
            <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">Already have an account? Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
