import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';

export default function RequestForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ startDate: '', endDate: '', purpose: '' });
  const [error, setError] = useState('');

  const { data: equipment, isLoading } = useQuery({
    queryKey: ['equipment', id],
    queryFn: async () => {
      const res = await api.get('/equipment'); // Quick hack: fetch all, filter. Better to have a getById.
      return res.data.find((e: any) => e._id === id);
    }
  });

  const createRequest = useMutation({
    mutationFn: async (data: any) => {
      await api.post('/requests', { ...data, equipmentId: id });
    },
    onSuccess: () => {
      navigate('/bookings');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to submit request');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    createRequest.mutate(formData);
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!equipment) return <div className="p-8 text-center text-red-500">Equipment not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-slate-800/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-700/50 overflow-hidden">
        <div className="bg-violet-600/20 border-b border-violet-500/20 backdrop-blur-md px-8 py-10 sm:p-12 text-white">
          <h3 className="text-3xl font-bold tracking-tight">
            Request {equipment.name}
          </h3>
          <div className="mt-3 text-violet-200 text-sm flex items-center gap-4 font-bold uppercase tracking-wider text-[10px]">
             <span className="bg-violet-500/30 border border-violet-500/30 px-3 py-1.5 rounded-lg">{equipment.department}</span>
             <span className="bg-violet-500/30 border border-violet-500/30 px-3 py-1.5 rounded-lg">{equipment.category}</span>
          </div>
        </div>
        
        <div className="px-8 py-10 sm:p-12">
          {equipment.usageRules && (
            <div className="mb-6 p-6 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-200 text-sm shadow-inner">
              <strong className="text-amber-400 block mb-1 uppercase tracking-wide text-xs">Usage Rules:</strong> {equipment.usageRules}
            </div>
          )}

          {error && <div className="mb-6 text-red-400 text-sm bg-red-900/20 p-4 rounded-xl border border-red-800/30 flex items-center"><span className="mr-2">⚠️</span>{error}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300">Start Date & Time</label>
                <input required type="datetime-local" className="mt-2 block w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl shadow-inner py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm transition-all"
                  value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300">End Date & Time</label>
                <input required type="datetime-local" className="mt-2 block w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl shadow-inner py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm transition-all"
                  value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300">Purpose of Usage</label>
              <textarea required rows={4} className="mt-2 block w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl shadow-inner py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm transition-all placeholder-slate-500"
                value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} placeholder="Describe the experiment or reason for using this equipment in detail..." />
            </div>
            <div className="pt-8 flex items-center justify-end border-t border-slate-700/50 gap-4">
              <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all">
                Cancel
              </button>
              <button type="submit" disabled={createRequest.isPending} className="px-6 py-3 bg-violet-600 border border-transparent rounded-xl text-sm font-bold text-white hover:bg-violet-500 shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-slate-900 disabled:opacity-50">
                {createRequest.isPending ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
