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
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 sm:p-10 text-white">
          <h3 className="text-2xl font-bold">
            Request {equipment.name}
          </h3>
          <div className="mt-2 text-blue-100 text-sm flex items-center gap-4">
             <span>{equipment.department}</span>
             <span>•</span>
             <span>{equipment.category}</span>
          </div>
        </div>
        
        <div className="px-6 py-8 sm:p-10">
          {equipment.usageRules && (
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 text-sm">
              <strong>Usage Rules:</strong> {equipment.usageRules}
            </div>
          )}

          {error && <div className="mb-6 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center"><span className="mr-2">⚠️</span>{error}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                <input required type="datetime-local" className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                <input required type="datetime-local" className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Purpose of Usage</label>
              <textarea required rows={4} className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} placeholder="Describe the experiment or reason for using this equipment in detail..." />
            </div>
            <div className="pt-6 flex items-center justify-end border-t border-gray-100 gap-3">
              <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                Cancel
              </button>
              <button type="submit" disabled={createRequest.isPending} className="px-5 py-2.5 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70">
                {createRequest.isPending ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
