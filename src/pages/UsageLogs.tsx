import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';
import { ClipboardList } from 'lucide-react';

export default function UsageLogs() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['usage'],
    queryFn: async () => {
      const res = await api.get('/requests/usage');
      return res.data;
    }
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading logs...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center">
        <ClipboardList className="w-8 h-8 mr-3 text-violet-500" />
        Equipment Usage History
      </h1>
      
      {logs?.length === 0 ? (
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-12 text-center text-slate-400 shadow-sm">
          No usage logs available at this time.
        </div>
      ) : (
        <div className="bg-slate-800/80 backdrop-blur-xl shadow-sm overflow-hidden sm:rounded-3xl border border-slate-700/50">
          <table className="min-w-full divide-y divide-slate-700/50">
            <thead className="bg-slate-900/50 backdrop-blur-md">
              <tr>
                <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Equipment</th>
                <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Time Slot</th>
                <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {logs?.map((log: any) => (
                <tr key={log._id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-white">
                    {log.equipmentId?.name || 'Deleted Equipment'}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-slate-400">
                    {log.userId?.name || 'Deleted User'}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-400 font-medium">
                    {format(new Date(log.startTime), 'MMM d, h:mm a')} <span className="text-slate-600 mx-2">➝</span> {format(new Date(log.endTime), 'h:mm a')}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex text-[10px] leading-4 uppercase font-bold rounded-lg shadow-sm border ${
                        log.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                      }`}>
                        {log.status}
                      </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
