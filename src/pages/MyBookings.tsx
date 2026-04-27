import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { CalendarClock, List, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { enUS } from 'date-fns/locale';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function MyBookings() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const res = await api.get('/requests');
      return res.data;
    }
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading bookings...</div>;

  const calendarEvents = requests?.map((req: any) => ({
    id: req._id,
    title: req.equipmentId?.name + ' (' + req.status + ')',
    start: new Date(req.startDate),
    end: new Date(req.endDate),
    resource: req
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <CalendarClock className="w-8 h-8 mr-3 text-violet-500" />
          My Requests & Bookings
        </h1>
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700/50 shadow-inner">
           <button 
             onClick={() => setViewMode('list')}
             className={`p-2.5 rounded-lg flex items-center transition-all ${viewMode === 'list' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
           >
             <List className="w-4 h-4" />
           </button>
           <button 
             onClick={() => setViewMode('calendar')}
             className={`p-2.5 rounded-lg flex items-center transition-all ${viewMode === 'calendar' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
           >
             <CalendarIcon className="w-4 h-4" />
           </button>
        </div>
      </div>
      
      {requests?.length === 0 ? (
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-12 text-center text-slate-400 shadow-sm">
          You haven't made any requests yet.
        </div>
      ) : (
        <>
          {viewMode === 'list' && (
            <div className="bg-slate-800/80 backdrop-blur-xl shadow-sm overflow-hidden sm:rounded-3xl border border-slate-700/50">
              <ul className="divide-y divide-slate-700/50">
                {requests?.map((req: any) => (
                  <li key={req._id}>
                    <div className="px-6 py-6 sm:px-8 hover:bg-slate-700/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-lg font-bold text-white truncate group-hover:text-violet-400 transition-colors">{req.equipmentId?.name}</p>
                          <div className="mt-1 flex text-sm text-slate-400 font-medium">
                            <span>{format(new Date(req.startDate), 'MMM d, yyyy h:mm a')} <span className="mx-2 text-slate-600">→</span> {format(new Date(req.endDate), 'MMM d, yyyy h:mm a')}</span>
                          </div>
                          <div className="mt-4 text-sm text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 shadow-inner inline-block">
                            <span className="font-semibold text-slate-500 mr-2 uppercase text-[10px] tracking-wider">Purpose</span>
                            <br/>
                            {req.purpose}
                          </div>
                          {req.managerNotes && (
                            <p className="mt-4 text-sm text-amber-300 bg-amber-500/10 p-4 flex items-center rounded-xl shadow-inner border border-amber-500/20">
                              <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-500/20 text-amber-200 px-2.5 py-1 rounded-lg mr-3">Note</span> {req.managerNotes}
                            </p>
                          )}
                        </div>
                        <div className="ml-6 flex-shrink-0">
                          <span className={`px-4 py-1.5 inline-flex text-xs leading-5 font-bold uppercase rounded-lg shadow-sm border ${
                            req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            req.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
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

          {viewMode === 'calendar' && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 h-[600px] overflow-hidden text-slate-800">
               <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={(event: any) => {
                  let backgroundColor = '#f59e0b'; // pending
                  if (event.resource.status === 'approved') backgroundColor = '#10b981';
                  if (event.resource.status === 'rejected') backgroundColor = '#ef4444';
                  return { style: { backgroundColor, borderRadius: '6px', border: 'none' } };
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
