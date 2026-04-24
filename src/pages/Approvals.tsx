import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';
import { Check, X, CalendarDays, Inbox } from 'lucide-react';

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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    }
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading pending requests...</div>;

  const pendingRequests = requests?.filter((r: any) => r.status === 'pending') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Inbox className="w-6 h-6 mr-3 text-blue-600" />
          Pending Approvals
        </h1>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
          {pendingRequests.length} pending
        </span>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Check className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">You're all caught up!</h3>
          <p className="mt-1 text-gray-500">No pending requests require your approval at this time.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm overflow-hidden rounded-xl border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {pendingRequests.map((req: any) => (
              <li key={req._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{req.equipmentId?.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="font-medium text-gray-900 mr-2">{req.userId?.name}</span> requested this equipment
                    </div>
                    <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                      "{req.purpose}"
                    </div>
                    <div className="mt-3 flex items-center text-sm font-medium text-gray-600">
                      <CalendarDays className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {format(new Date(req.startDate), 'MMM d, yyyy h:mm a')} <span className="mx-2 text-gray-400">→</span> {format(new Date(req.endDate), 'MMM d, h:mm a')}
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 mt-4 sm:mt-0 items-start sm:items-end">
                    <button
                      onClick={() => updateStatus.mutate({ id: req._id, status: 'approved' })}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      <Check className="w-4 h-4 mr-2" /> Approve
                    </button>
                    <button
                      onClick={() => updateStatus.mutate({ id: req._id, status: 'rejected' })}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" /> Reject
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
