import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { format } from 'date-fns';
import { Check, X, Clock, CalendarDays, Activity, Box, Search, PlayCircle, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin';

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: async () => {
      const res = await api.get('/dashboard/overview');
      return res.data;
    }
  });

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 bg-slate-800 rounded w-64 mb-2"></div>
          <div className="h-4 bg-slate-800 rounded w-48"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800/80 p-6 rounded-3xl h-32 border border-slate-700/50"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="h-8 bg-slate-800 rounded w-48 mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800/80 rounded-3xl border border-slate-700/50"></div>
          ))}
        </div>
        <div className="col-span-1 space-y-6">
          <div className="h-8 bg-slate-800 rounded w-48 mb-6"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-800/80 rounded-2xl border border-slate-700/50"></div>
          ))}
        </div>
      </div>
    </div>
  );

  const { stats, recentActivity, upcomingBookings, usageAnalytics } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Overview</h1>
      
      {/* SECTION 1: Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-700/50">
          <div className="flex items-center">
            <div className="p-4 bg-violet-500/20 rounded-2xl shadow-inner border border-violet-500/20">
              <Box className="w-6 h-6 text-violet-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Total Equipment</p>
              <h3 className="text-2xl font-bold text-white">{stats?.totalEquipment || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-700/50">
          <div className="flex items-center">
            <div className="p-4 bg-emerald-500/20 rounded-2xl shadow-inner border border-emerald-500/20">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Available Now</p>
              <h3 className="text-2xl font-bold text-white">{stats?.availableEquipment || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-700/50">
          <div className="flex items-center">
            <div className="p-4 bg-fuchsia-500/20 rounded-2xl shadow-inner border border-fuchsia-500/20">
              <CalendarDays className="w-6 h-6 text-fuchsia-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">My Active Bookings</p>
              <h3 className="text-2xl font-bold text-white">{stats?.myActiveBookings || 0}</h3>
            </div>
          </div>
        </div>
        {isManagerOrAdmin ? (
          <Link to="/approvals" className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-700/50 hover:shadow-violet-900/20 transition-all cursor-pointer block hover:scale-[1.02] hover:border-violet-500/30">
            <div className="flex items-center">
              <div className="p-4 bg-amber-500/20 rounded-2xl shadow-inner border border-amber-500/20">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400 hover:text-violet-400 transition-colors">Pending Approvals ➔</p>
                <h3 className="text-2xl font-bold text-white">{stats?.pendingRequestsCount || 0}</h3>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-700/50">
            <div className="flex items-center">
              <div className="p-4 bg-amber-500/20 rounded-2xl shadow-inner border border-amber-500/20">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Pending Requests</p>
                <h3 className="text-2xl font-bold text-white">{stats?.pendingRequestsCount || 0}</h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {isManagerOrAdmin && usageAnalytics && usageAnalytics.length > 0 && (
        <div className="mb-8 bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-700/50">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
             <BarChart2 className="w-5 h-5 mr-2 text-violet-400" />
             Equipment Usage Trends
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageAnalytics} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {usageAnalytics.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#c084fc'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SECTION 2: Recent Activity */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-violet-400" />
             Activity Feed
          </h2>
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-700/50 overflow-hidden">
            {recentActivity?.length === 0 ? (
               <div className="p-8 text-center">
                 <p className="text-slate-400 mb-4">No recent activity detected.</p>
                 <Link to="/equipment" className="inline-flex font-medium items-center text-violet-400 hover:text-violet-300 transition-colors">
                    <Search className="w-4 h-4 mr-2" /> Browse Equipment
                 </Link>
               </div>
            ) : (
              <ul className="divide-y divide-slate-700/50">
                {recentActivity?.map((activity: any) => {
                  const ActivityIcon = activity.status === 'approved' ? Check : activity.status === 'rejected' ? X : Clock;
                  const iconColor = activity.status === 'approved' ? 'text-emerald-400' : activity.status === 'rejected' ? 'text-red-400' : 'text-amber-400';
                  const bgColor = activity.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20' : activity.status === 'rejected' ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20';

                  return (
                    <li key={activity._id} className="p-6 hover:bg-slate-700/30 transition-colors flex items-start space-x-4">
                       <div className={`p-3 rounded-2xl border ${bgColor}`}>
                         <ActivityIcon className={`w-5 h-5 ${iconColor}`} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm text-slate-300">
                            <strong className="text-white">{activity.userId?.name}</strong> {activity.status === 'pending' ? 'requested' : activity.status} 
                            {" "} <span className="font-semibold text-violet-400">{activity.equipmentId?.name}</span>
                         </p>
                         <p className="text-xs text-slate-500 mt-2">
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
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PlayCircle className="w-5 h-5 mr-2 text-slate-400" />
            Upcoming Bookings
          </h2>
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-700/50 overflow-hidden">
             {upcomingBookings?.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">
                  You have no upcoming bookings.
                </div>
             ) : (
               <ul className="divide-y divide-slate-700/50 p-2">
                 {upcomingBookings?.map((booking: any) => (
                    <li key={booking._id} className="p-4 rounded-2xl hover:bg-slate-700/30 transition-colors border border-transparent hover:border-slate-600 mb-1">
                       <h3 className="text-sm font-semibold text-white truncate">{booking.equipmentId?.name}</h3>
                       <p className="text-xs text-slate-400 mt-2 flex items-center">
                          <CalendarDays className="w-4 h-4 mr-1.5" />
                          {format(new Date(booking.startDate), 'MMM d, h:mm a')}
                       </p>
                       <div className="flex mt-3 items-center justify-between">
                          <span className="text-xs text-slate-500">{booking.equipmentId?.location || 'No location'}</span>
                          <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-lg border ${
                             booking.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
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
