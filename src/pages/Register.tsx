import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '', role: 'researcher' });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
        </div>
        {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input name="name" type="text" required onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input name="email" type="email" required onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" required minLength={6} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Department</label>
            <input name="department" type="text" required onChange={handleChange} placeholder="e.g. Biology" className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option value="researcher">Researcher</option>
              <option value="manager">Department Manager</option>
              <option value="admin">System Admin</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Note: Role selection is open for demo purposes.</p>
          </div>
          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Already have an account? Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
