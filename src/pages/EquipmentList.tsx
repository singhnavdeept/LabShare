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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Equipment Directory</h1>
        {canManage && (
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Equipment
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className="bg-slate-800/80 backdrop-blur-xl p-4 rounded-3xl shadow-sm border border-slate-700/50 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
         <div className="flex flex-1 w-full gap-4 items-center">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input type="text" placeholder="Search equipment..." className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm shadow-inner transition-all" />
           </div>
           <select className="border border-slate-700 bg-slate-900/50 text-white rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-violet-500 shadow-inner transition-all" value={bookingFilter} onChange={e => setBookingFilter(e.target.value)}>
             <option value="">All Categories</option>
             <option value="Lab">Lab</option>
             <option value="Compute">Compute</option>
             <option value="Electronics">Electronics</option>
           </select>
         </div>
      </div>

      {showAdd && (
        <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-700/50 mb-8 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-white">Add New Equipment</h2>
          <form onSubmit={e => { e.preventDefault(); addEq.mutate({ ...newEq, department: user?.department }); }}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-slate-300">Name *</label>
                <input required type="text" className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-900/50 text-white shadow-inner focus:border-violet-500 focus:ring-violet-500 sm:text-sm px-4 py-3 transition-all" value={newEq.name} onChange={e => setNewEq({ ...newEq, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Category</label>
                <select className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-900/50 text-white shadow-inner focus:border-violet-500 focus:ring-violet-500 sm:text-sm px-4 py-3 transition-all" value={newEq.category} onChange={e => setNewEq({ ...newEq, category: e.target.value })}>
                  {['Lab', 'Compute', 'Room', 'Electronics', 'Fabrication'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Location</label>
                <input type="text" className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-900/50 text-white shadow-inner focus:border-violet-500 focus:ring-violet-500 sm:text-sm px-4 py-3 transition-all" value={newEq.location} onChange={e => setNewEq({ ...newEq, location: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Quantity</label>
                <input type="number" min="1" className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-900/50 text-white shadow-inner focus:border-violet-500 focus:ring-violet-500 sm:text-sm px-4 py-3 transition-all" value={newEq.totalQuantity} onChange={e => setNewEq({ ...newEq, totalQuantity: parseInt(e.target.value) || 1 })} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Booking Type</label>
                 <select className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-900/50 text-white shadow-inner focus:border-violet-500 focus:ring-violet-500 sm:text-sm px-4 py-3 transition-all" value={newEq.bookingType} onChange={e => setNewEq({ ...newEq, bookingType: e.target.value })}>
                  <option value="exclusive">Exclusive Use</option>
                  <option value="multiple">Multiple Concurrent Users</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Condition</label>
                <select className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-900/50 text-white shadow-inner focus:border-violet-500 focus:ring-violet-500 sm:text-sm px-4 py-3 transition-all" value={newEq.condition} onChange={e => setNewEq({ ...newEq, condition: e.target.value })}>
                  {['Good', 'Maintenance', 'Limited'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="sm:col-span-3">
                <label className="text-sm font-medium text-slate-300">Description *</label>
                <textarea required rows={2} className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-900/50 text-white shadow-inner focus:border-violet-500 focus:ring-violet-500 sm:text-sm px-4 py-3 transition-all" value={newEq.description} onChange={e => setNewEq({ ...newEq, description: e.target.value })} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-slate-700/50">
              <button type="button" onClick={() => setShowAdd(false)} className="px-6 py-3 border border-slate-600 rounded-xl shadow-sm text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors">Cancel</button>
              <button type="submit" disabled={addEq.isPending} className="px-6 py-3 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {equipment
          ?.filter((eq: any) => !bookingFilter || eq.category === bookingFilter)
          .map((eq: any) => (
          <div key={eq._id} className="bg-slate-800/80 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-xl transition-all rounded-3xl border border-slate-700/50 flex flex-col group hover:border-violet-500/30">
            <div className="px-6 py-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 bg-violet-500/20 border border-violet-500/20 px-2.5 py-1 rounded-lg">{eq.category || 'Lab'}</span>
                   </div>
                   <h3 className="text-xl font-bold text-white leading-tight group-hover:text-violet-400 transition-colors">{eq.name}</h3>
                   <p className="text-sm text-slate-400 mt-1.5 font-medium">{eq.department}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className={`px-2.5 py-1 inline-flex text-[10px] leading-none font-bold uppercase rounded-lg border ${
                    eq.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {eq.status === 'available' ? 'Available' : 'Unavailable'}
                  </span>
                  {eq.condition && eq.condition !== 'Good' && (
                     <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-1 uppercase rounded-lg">{eq.condition}</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 mt-5 leading-relaxed">{eq.description}</p>
              
              <div className="mt-6 grid grid-cols-2 gap-4 pt-5 border-t border-slate-700/50">
                 <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Location</p>
                    <p className="text-sm text-white font-semibold mt-1 truncate">{eq.location || 'Not specified'}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Quantity</p>
                    <p className="text-sm text-white font-semibold mt-1">{eq.availableQuantity || 1} <span className="text-slate-500 font-normal">/ {eq.totalQuantity || 1}</span></p>
                 </div>
              </div>
            </div>
            <div className="px-6 py-5 bg-slate-900/50 border-t border-slate-700/50 backdrop-blur-sm">
               <a href={`/request/${eq._id}`} className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl shadow-md text-sm font-bold text-white transition-all ${
                  eq.status === 'available' ? 'bg-violet-600 hover:bg-violet-500 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-slate-900' : 'bg-slate-700 text-slate-400 cursor-not-allowed'
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
