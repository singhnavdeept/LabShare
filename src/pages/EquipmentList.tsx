import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Beaker, Search, AlertCircle, Plus, QrCode, Hammer, X, Image as ImageIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

// QR Code Modal Component
const QRCodeModal = ({ eq, onClose }: { eq: any, onClose: () => void }) => {
  if (!eq) return null;
  const qrUrl = `${window.location.origin}/request/${eq._id}`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl relative max-w-sm w-full flex flex-col items-center">
         <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
         </button>
         <h3 className="text-xl font-bold text-white mb-6 text-center">{eq.name}</h3>
         <div className="bg-white p-4 rounded-2xl shadow-inner mb-6">
           <QRCodeSVG value={qrUrl} size={200} />
         </div>
         <p className="text-sm text-slate-400 text-center font-medium">Scan this QR code to quickly access the request form for this equipment.</p>
      </div>
    </div>
  );
}

export default function EquipmentList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [showAdd, setShowAdd] = useState(false);
  const [qrEq, setQrEq] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('add') === 'true' && (user?.role === 'admin' || user?.role === 'manager')) {
      setShowAdd(true);
    }
  }, [location.search, user]);

  const [newEq, setNewEq] = useState({ 
    name: '', description: '', status: 'available', usageRules: '', 
    category: 'Lab', totalQuantity: 1, bookingType: 'exclusive', location: '', condition: 'Good', imageUrl: '' 
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEq(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

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
      setNewEq({ name: '', description: '', status: 'available', usageRules: '', category: 'Lab', totalQuantity: 1, bookingType: 'exclusive', location: '', condition: 'Good', imageUrl: '' });
      toast.success('Equipment added successfully');
    }
  });

  const updateStatus = useMutation({
    mutationFn: async (data: { id: string, status: string }) => {
      await api.put(`/equipment/${data.id}`, { status: data.status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    }
  });

  const [filters, setFilters] = useState({ category: '', condition: '', status: '', search: '', sort: 'newest' });

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div className="h-10 bg-slate-800 rounded w-64"></div>
      </div>
      <div className="bg-slate-800/80 p-4 rounded-3xl h-20 border border-slate-700/50 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-800/80 rounded-3xl h-64 border border-slate-700/50"></div>
        ))}
      </div>
    </div>
  );

  const canManage = user?.role === 'admin' || user?.role === 'manager';

  const filteredEquipment = equipment?.filter((eq: any) => {
    if (filters.category && eq.category !== filters.category) return false;
    if (filters.condition && eq.condition !== filters.condition) return false;
    if (filters.status && eq.status !== filters.status) return false;
    if (filters.search && !eq.name.toLowerCase().includes(filters.search.toLowerCase()) && !eq.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }).sort((a: any, b: any) => {
    if (filters.sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (filters.sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (filters.sort === 'a-z') return a.name.localeCompare(b.name);
    if (filters.sort === 'z-a') return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {qrEq && <QRCodeModal eq={qrEq} onClose={() => setQrEq(null)} />}
      
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
      <div className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-700/50 mb-8 flex flex-col gap-4">
         <div className="flex flex-col sm:flex-row gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input type="text" placeholder="Search equipment..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm shadow-inner transition-all" />
           </div>
           <select className="border border-slate-700 bg-slate-900/50 text-white rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-violet-500 shadow-inner transition-all w-full sm:w-auto" value={filters.sort} onChange={e => setFilters({...filters, sort: e.target.value})}>
             <option value="newest">Recently Added</option>
             <option value="oldest">Oldest First</option>
             <option value="a-z">Name A-Z</option>
             <option value="z-a">Name Z-A</option>
           </select>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
           <div>
             <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
             <select className="w-full border border-slate-700 bg-slate-900/50 text-white rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-violet-500 shadow-inner overflow-hidden" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
               <option value="">All Categories</option>
               <option value="Lab">Lab</option>
               <option value="Compute">Compute</option>
               <option value="Electronics">Electronics</option>
               <option value="Room">Room</option>
               <option value="Fabrication">Fabrication</option>
             </select>
           </div>
           <div>
             <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Condition</label>
             <select className="w-full border border-slate-700 bg-slate-900/50 text-white rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-violet-500 shadow-inner overflow-hidden" value={filters.condition} onChange={e => setFilters({...filters, condition: e.target.value})}>
               <option value="">All Conditions</option>
               <option value="Good">Good</option>
               <option value="Maintenance">Maintenance Needed</option>
               <option value="Limited">Limited Functionality</option>
             </select>
           </div>
           <div>
             <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
             <select className="w-full border border-slate-700 bg-slate-900/50 text-white rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-violet-500 shadow-inner overflow-hidden" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
               <option value="">All Statuses</option>
               <option value="available">Available</option>
               <option value="maintenance">In Maintenance</option>
               <option value="retired">Retired</option>
             </select>
           </div>
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
              <div className="sm:col-span-3 pb-2 border-b border-slate-700/50">
                <label className="text-sm font-medium text-slate-300">Description *</label>
                <textarea required rows={2} className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-900/50 text-white shadow-inner focus:border-violet-500 focus:ring-violet-500 sm:text-sm px-4 py-3 transition-all" value={newEq.description} onChange={e => setNewEq({ ...newEq, description: e.target.value })} />
              </div>
              <div className="sm:col-span-3">
                <label className="text-sm font-medium text-slate-300">Equipment Image</label>
                <div className="mt-2 flex items-center gap-4">
                  {newEq.imageUrl ? (
                    <img src={newEq.imageUrl} alt="Preview" className="h-16 w-16 object-cover rounded-xl border border-slate-700" />
                  ) : (
                    <div className="h-16 w-16 bg-slate-900/50 rounded-xl border border-slate-700 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-slate-500" />
                    </div>
                  )}
                  <div className="flex-1">
                     <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-500/10 file:text-violet-400 hover:file:bg-violet-500/20 transition-all cursor-pointer" />
                     <p className="mt-1 text-xs text-slate-500">Upload a photo of the equipment (max 1MB). It will be scaled and stored automatically.</p>
                  </div>
                </div>
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
        {filteredEquipment?.map((eq: any) => (
          <div key={eq._id} className="bg-slate-800/80 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-xl transition-all rounded-3xl border border-slate-700/50 flex flex-col group hover:border-violet-500/30 relative">
            <div className="absolute top-4 right-4 flex space-x-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
               {canManage && (
                 <button 
                   title={eq.status === 'maintenance' ? 'Mark Available' : 'Mark Maintenance'}
                   onClick={() => updateStatus.mutate({ id: eq._id, status: eq.status === 'maintenance' ? 'available' : 'maintenance' })}
                   className={`p-2 rounded-full backdrop-blur-md shadow-md border transition-all hover:scale-110 ${eq.status === 'maintenance' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/40' : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:bg-slate-800'}`}
                 >
                   <Hammer className="w-4 h-4" />
                 </button>
               )}
               <button 
                 title="QR Code"
                 onClick={() => setQrEq(eq)}
                 className="p-2 bg-slate-900/50 backdrop-blur-md border border-slate-600 text-slate-300 rounded-full shadow-md hover:bg-slate-800 transition-all hover:scale-110"
               >
                 <QrCode className="w-4 h-4" />
               </button>
            </div>
            
            {eq.imageUrl ? (
              <div className="w-full h-48 bg-slate-900">
                <img src={eq.imageUrl} alt={eq.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <div className="w-full h-32 bg-slate-900/50 flex items-center justify-center border-b border-slate-700/50">
                <Beaker className="w-12 h-12 text-slate-700" />
              </div>
            )}
            
            <div className="px-6 py-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 bg-violet-500/20 border border-violet-500/20 px-2.5 py-1 rounded-lg">{eq.category || 'Lab'}</span>
                   </div>
                   <h3 className="text-xl font-bold text-white leading-tight group-hover:text-violet-400 transition-colors pr-16">{eq.name}</h3>
                   <p className="text-sm text-slate-400 mt-1.5 font-medium">{eq.department}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                 <span className={`px-2.5 py-1 inline-flex text-[10px] items-center leading-none font-bold uppercase rounded-lg border ${
                  eq.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  eq.status === 'maintenance' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {eq.status === 'available' ? 'Available' : eq.status === 'maintenance' ? 'In Maintenance' : 'Unavailable'}
                </span>
                {eq.condition && eq.condition !== 'Good' && (
                   <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-1 uppercase rounded-lg">{eq.condition}</span>
                )}
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 mt-2 leading-relaxed">{eq.description}</p>
              
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
                  eq.status === 'available' ? 'bg-violet-600 hover:bg-violet-500 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-slate-900' : 'bg-slate-700 text-slate-400 cursor-not-allowed hidden'
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
