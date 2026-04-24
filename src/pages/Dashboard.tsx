import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { format } from 'date-fns';
import { Check, X, Clock, CalendarDays, Activity, Box, Search, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: async () => {
      const res = await api.get('/dashboard/overview');
      return res.data;
    }
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  const { stats, recentActivity, upcomingBookings } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Overview</h1>
      
      {/* SECTION 1: Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Box className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Equipment</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.totalEquipment || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Available Now</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.availableEquipment || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <CalendarDays className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">My Active Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.myActiveBookings || 0}</h3>
            </div>
          </div>
        </div>
        {user?.role === 'manager' || user?.role === 'admin' ? (
          <Link to="/approvals" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer block">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 hover:text-blue-600">Pending Approvals ➔</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats?.pendingRequestsCount || 0}</h3>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats?.pendingRequestsCount || 0}</h3>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SECTION 2: Recent Activity */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-gray-500" />
             Activity Feed
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {recentActivity?.length === 0 ? (
               <div className="p-8 text-center">
                 <p className="text-gray-500 mb-4">No recent activity detected.</p>
                 <Link to="/equipment" className="inline-flex font-medium items-center text-blue-600 hover:text-blue-500">
                    <Search className="w-4 h-4 mr-2" /> Browse Equipment
                 </Link>
               </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentActivity?.map((activity: any) => {
                  const ActivityIcon = activity.status === 'approved' ? Check : activity.status === 'rejected' ? X : Clock;
                  const iconColor = activity.status === 'approved' ? 'text-green-500' : activity.status === 'rejected' ? 'text-red-500' : 'text-yellow-500';
                  const bgColor = activity.status === 'approved' ? 'bg-green-50' : activity.status === 'rejected' ? 'bg-red-50' : 'bg-yellow-50';

                  return (
                    <li key={activity._id} className="p-4 hover:bg-gray-50 transition-colors flex items-start space-x-4">
                       <div className={`p-2 rounded-full mt-1 ${bgColor}`}>
                         <ActivityIcon className={`w-4 h-4 ${iconColor}`} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm text-gray-900">
                            <strong>{activity.userId?.name}</strong> {activity.status === 'pending' ? 'requested' : activity.status} 
                            {" "} <span className="font-medium text-blue-600">{activity.equipmentId?.name}</span>
                         </p>
                         <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(activity.updatedAt), 'MMM d, h:mm a')} • {activity.equipmentId?.category}
                         </p>
                       </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {/* SECTION 3: My Upcoming Bookings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PlayCircle className="w-5 h-5 mr-2 text-gray-500" />
            Upcoming Bookings
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             {upcomingBookings?.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  You have no upcoming bookings.
                </div>
             ) : (
               <ul className="divide-y divide-gray-100 p-2">
                 {upcomingBookings?.map((booking: any) => (
                    <li key={booking._id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 mb-1">
                       <h3 className="text-sm font-semibold text-gray-900 truncate">{booking.equipmentId?.name}</h3>
                       <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <CalendarDays className="w-3 h-3 mr-1" />
                          {format(new Date(booking.startDate), 'MMM d, h:mm a')}
                       </p>
                       <div className="flex mt-2 items-center justify-between">
                          <span className="text-xs text-gray-400">{booking.equipmentId?.location || 'No location'}</span>
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold rounded-full ${
                             booking.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status}
                          </span>
                       </div>
                    </li>
                 ))}
               </ul>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
