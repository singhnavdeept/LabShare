import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';
import { Check, X, CalendarDays, Inbox } from 'lucide-react';
import { toast } from 'sonner';

export default function Approvals() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const res = await api.get('/requests');
      return res.data;
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.put(`/requests/${id}/status`, { status });
      return status;
    },
    onSuccess: (status) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      if (status === 'approved') {
        toast.success('Request approved successfully');
      } else {
        toast.info('Request rejected');
      }
    }
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading pending requests...</div>;

  const pendingRequests = requests?.filter((r: any) => r.status === 'pending') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Inbox className="w-8 h-8 mr-3 text-violet-500" />
          Pending Approvals
        </h1>
        <span className="bg-amber-500/20 shadow-inner border border-amber-500/20 text-amber-300 text-[11px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full">
          {pendingRequests.length} pending
        </span>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-700/50 p-16 text-center">
          <Check className="w-16 h-16 mx-auto text-slate-500 mb-6" />
          <h3 className="text-xl font-bold text-white">You're all caught up!</h3>
          <p className="mt-2 text-slate-400 font-medium">No pending requests require your approval at this time.</p>
        </div>
      ) : (
        <div className="bg-slate-800/80 backdrop-blur-xl shadow-sm overflow-hidden rounded-3xl border border-slate-700/50">
          <ul className="divide-y divide-slate-700/50">
            {pendingRequests.map((req: any) => (
              <li key={req._id} className="p-8 hover:bg-slate-700/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{req.equipmentId?.name}</h3>
                    <div className="mt-2 flex items-center text-sm text-slate-400">
                      <span className="font-semibold text-violet-400 mr-2">{req.userId?.name}</span> requested this equipment
                    </div>
                    <div className="mt-4 text-sm text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 shadow-inner">
                      <span className="font-semibold text-slate-500 mr-2 uppercase text-[10px] tracking-wider">Purpose</span>
                      <br/>
                      "{req.purpose}"
                    </div>
                    <div className="mt-4 flex items-center text-sm font-semibold text-slate-400">
                      <CalendarDays className="flex-shrink-0 mr-2 h-5 w-5 text-violet-500" />
                      {format(new Date(req.startDate), 'MMM d, yyyy h:mm a')} <span className="mx-3 text-slate-600">→</span> {format(new Date(req.endDate), 'MMM d, h:mm a')}
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-3 mt-6 sm:mt-0 items-start sm:items-end">
                    <button
                      onClick={() => updateStatus.mutate({ id: req._id, status: 'approved' })}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent shadow-md text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 transition-all cursor-pointer"
                    >
                      <Check className="w-5 h-5 mr-2" /> Approve
                    </button>
                    <button
                      onClick={() => updateStatus.mutate({ id: req._id, status: 'rejected' })}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-slate-600 shadow-sm text-sm font-bold rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-red-400 hover:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-900 transition-all cursor-pointer"
                    >
                      <X className="w-5 h-5 mr-2" /> Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
