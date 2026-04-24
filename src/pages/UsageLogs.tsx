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
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <ClipboardList className="w-6 h-6 mr-3 text-blue-600" />
        Equipment Usage History
      </h1>
      
      {logs?.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          No usage logs available.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs?.map((log: any) => (
                <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.equipmentId?.name || 'Deleted Equipment'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.userId?.name || 'Deleted User'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(log.startTime), 'MMM d, h:mm a')} ➝ {format(new Date(log.endTime), 'h:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
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
