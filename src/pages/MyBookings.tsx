import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';
import { CalendarClock } from 'lucide-react';

export default function MyBookings() {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const res = await api.get('/requests');
      return res.data;
    }
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading bookings...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <CalendarClock className="w-6 h-6 mr-3 text-blue-600" />
        My Requests & Bookings
      </h1>
      
      {requests?.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          You haven't made any requests yet.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {requests?.map((req: any) => (
              <li key={req._id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-blue-600 truncate">{req.equipmentId?.name}</p>
                      <div className="mt-1 flex text-sm text-gray-500">
                        <span>{format(new Date(req.startDate), 'MMM d, yyyy h:mm a')} - {format(new Date(req.endDate), 'MMM d, yyyy h:mm a')}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">Purpose: {req.purpose}</p>
                      {req.managerNotes && (
                        <p className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded">Note: {req.managerNotes}</p>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        req.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        req.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
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
