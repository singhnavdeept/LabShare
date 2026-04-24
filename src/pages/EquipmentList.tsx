import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Beaker, Search, AlertCircle, Plus } from 'lucide-react';

export default function EquipmentList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newEq, setNewEq] = useState({ 
    name: '', description: '', status: 'available', usageRules: '', 
    category: 'Lab', totalQuantity: 1, bookingType: 'exclusive', location: '', condition: 'Good' 
  });

  const { data: equipment, isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const res = await api.get('/equipment');
      return res.data;
    }
  });

  const addEq = useMutation({
    mutationFn: async (data: any) => {
      await api.post('/equipment', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setShowAdd(false);
      setNewEq({ name: '', description: '', status: 'available', usageRules: '', category: 'Lab', totalQuantity: 1, bookingType: 'exclusive', location: '', condition: 'Good' });
    }
  });

  const [bookingFilter, setBookingFilter] = useState('');

  if (isLoading) return <div className="p-8 text-center">Loading equipment...</div>;

  const canManage = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Equipment Directory</h1>
        {canManage && (
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Equipment
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
         <div className="flex flex-1 w-full gap-4 items-center">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input type="text" placeholder="Search equipment..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
           </div>
           <select className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500" value={bookingFilter} onChange={e => setBookingFilter(e.target.value)}>
             <option value="">All Categories</option>
             <option value="Lab">Lab</option>
             <option value="Compute">Compute</option>
             <option value="Electronics">Electronics</option>
           </select>
         </div>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-6">
          <h2 className="text-lg font-medium mb-4">Add New Equipment</h2>
          <form onSubmit={e => { e.preventDefault(); addEq.mutate({ ...newEq, department: user?.department }); }}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Name *</label>
                <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border" value={newEq.name} onChange={e => setNewEq({ ...newEq, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border" value={newEq.category} onChange={e => setNewEq({ ...newEq, category: e.target.value })}>
                  {['Lab', 'Compute', 'Room', 'Electronics', 'Fabrication'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border" value={newEq.location} onChange={e => setNewEq({ ...newEq, location: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <input type="number" min="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border" value={newEq.totalQuantity} onChange={e => setNewEq({ ...newEq, totalQuantity: parseInt(e.target.value) || 1 })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Booking Type</label>
                 <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border" value={newEq.bookingType} onChange={e => setNewEq({ ...newEq, bookingType: e.target.value })}>
                  <option value="exclusive">Exclusive Use</option>
                  <option value="multiple">Multiple Concurrent Users</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Condition</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border" value={newEq.condition} onChange={e => setNewEq({ ...newEq, condition: e.target.value })}>
                  {['Good', 'Maintenance', 'Limited'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="sm:col-span-3">
                <label className="text-sm font-medium text-gray-700">Description *</label>
                <textarea required rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border" value={newEq.description} onChange={e => setNewEq({ ...newEq, description: e.target.value })} />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={() => setShowAdd(false)} className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={addEq.isPending} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {equipment
          ?.filter((eq: any) => !bookingFilter || eq.category === bookingFilter)
          .map((eq: any) => (
          <div key={eq._id} className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-200 flex flex-col">
            <div className="px-5 py-5 flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-blue-700 bg-blue-50">{eq.category || 'Lab'}</span>
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 leading-tight">{eq.name}</h3>
                   <p className="text-sm text-gray-500 mt-1">{eq.department}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className={`px-2 py-1 inline-flex text-[11px] leading-none font-semibold rounded-full ${
                    eq.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {eq.status === 'available' ? 'Available' : 'Unavailable'}
                  </span>
                  {eq.condition && eq.condition !== 'Good' && (
                     <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded">{eq.condition}</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mt-4">{eq.description}</p>
              
              <div className="mt-5 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                 <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Location</p>
                    <p className="text-sm text-gray-800 font-medium mt-0.5 truncate">{eq.location || 'Not specified'}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Quantity</p>
                    <p className="text-sm text-gray-800 font-medium mt-0.5">{eq.availableQuantity || 1} / {eq.totalQuantity || 1}</p>
                 </div>
              </div>
            </div>
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
               <a href={`/request/${eq._id}`} className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
                  eq.status === 'available' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' : 'bg-gray-300 cursor-not-allowed'
               }`}
               onClick={e => { if(eq.status !== 'available') e.preventDefault() }}>
                  Request Equipment
               </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
