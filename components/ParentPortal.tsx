import React, { useState } from 'react';
import { Card } from './ui/Card';
import { INITIAL_STUDENTS, INITIAL_INVOICES, INITIAL_TEACHERS } from '../data';
import {
   User, Calendar, DollarSign, MessageSquare,
   TrendingUp, Clock, AlertCircle, CheckCircle, ChevronRight,
   GraduationCap, Bus, BookOpen
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../locale';

interface ParentPortalProps {
   onNavigate: (view: string) => void;
}

// Mock parent session
const CURRENT_PARENT_NAME = "Robert Morgan";

const attendanceData = [
   { name: 'Mon', present: 1 },
   { name: 'Tue', present: 1 },
   { name: 'Wed', present: 1 },
   { name: 'Thu', present: 0.5 }, // Half day
   { name: 'Fri', present: 1 },
];

export const ParentPortal: React.FC<ParentPortalProps> = ({ onNavigate }) => {
   // Filter children for the logged-in parent
   const myChildren = INITIAL_STUDENTS.filter(s => s.parent === CURRENT_PARENT_NAME);

   // Default to first child if exists
   const [selectedChildId, setSelectedChildId] = useState<string>(myChildren[0]?.id || '');

   const selectedChild = myChildren.find(c => c.id === selectedChildId);

   // Get Invoices for selected child
   const childInvoices = INITIAL_INVOICES.filter(inv => inv.studentId === selectedChildId);
   const totalDue = childInvoices.filter(inv => inv.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

   // Mock assigned teachers (picking first 3 for demo)
   const childTeachers = INITIAL_TEACHERS.slice(0, 3);

   if (myChildren.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
            <User size={48} className="mb-4 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-700">No Student Records Found</h2>
            <p>It seems there are no students linked to your account.</p>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center animate-fade-in-up">
            <div>
               <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Parent Portal</h1>
               <p className="text-slate-400 mt-1">Overview for {CURRENT_PARENT_NAME}</p>
            </div>
         </div>

         {/* Child Selector - Enhanced Cards */}
         <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-1">
            {myChildren.map(child => {
               const isSelected = selectedChildId === child.id;
               return (
                  <div
                     key={child.id}
                     onClick={() => setSelectedChildId(child.id)}
                     className={`relative min-w-[300px] cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 group overflow-hidden ${isSelected
                        ? 'bg-white border-indigo-500 shadow-xl shadow-indigo-100 ring-4 ring-indigo-50'
                        : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-lg'
                        }`}
                  >
                     {/* Visual Indicator Bar */}
                     {isSelected && (
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full">
                           <div className="absolute inset-0 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full animate-pulse opacity-50"></div>
                        </div>
                     )}

                     <div className="flex items-center gap-4">
                        <div className="relative">
                           <img
                              src={`https://ui-avatars.com/api/?name=${child.name}&background=random`}
                              alt={child.name}
                              className={`w-16 h-16 rounded-2xl object-cover border-4 transition-colors shadow-sm ${isSelected ? 'border-indigo-100' : 'border-slate-50'}`}
                           />
                           <span className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${child.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        </div>
                        <div>
                           <h3 className={`font-bold text-lg leading-tight mb-1 ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{child.name}</h3>
                           <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                                 <BookOpen size={10} /> {child.class}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                                 Roll: {child.id.split('-')[1]}
                              </span>
                           </div>
                        </div>
                     </div>

                     {isSelected && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center animate-in fade-in duration-300">
                           <span className="text-xs font-medium text-slate-400">View Profile</span>
                           <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                              <ChevronRight size={14} />
                           </div>
                        </div>
                     )}
                  </div>
               );
            })}
         </div>

         {selectedChild && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Left Column - Stats & Attendance */}
               <div className="lg:col-span-2 space-y-6">
                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <Card className="bg-emerald-50 border-emerald-100 hover:shadow-md transition-shadow">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-emerald-600 uppercase mb-1 flex items-center gap-1"><CheckCircle size={12} /> Attendance</span>
                           <span className="text-2xl font-bold text-slate-800">{selectedChild.attendance}%</span>
                           <span className="text-[10px] text-emerald-600/70 font-medium mt-1">Excellent</span>
                        </div>
                     </Card>
                     <Card className="bg-amber-50 border-amber-100 hover:shadow-md transition-shadow">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-amber-600 uppercase mb-1 flex items-center gap-1"><span style={{ fontWeight: 800 }}>R</span> Fee Due</span>
                           <span className="text-2xl font-bold text-slate-800">{formatCurrency(totalDue)}</span>
                           <span className="text-[10px] text-amber-600/70 font-medium mt-1">Pay by 30th</span>
                        </div>
                     </Card>
                     <Card className="bg-purple-50 border-purple-100 hover:shadow-md transition-shadow">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-purple-600 uppercase mb-1 flex items-center gap-1"><Clock size={12} /> Next Exam</span>
                           <span className="text-lg font-bold text-slate-800">Oct 20</span>
                           <span className="text-[10px] text-purple-600/70 font-medium mt-1">Mid-Term Math</span>
                        </div>
                     </Card>
                     <Card className="bg-blue-50 border-blue-100 hover:shadow-md transition-shadow">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-blue-600 uppercase mb-1 flex items-center gap-1"><Calendar size={12} /> Events</span>
                           <span className="text-lg font-bold text-slate-800">Sports Day</span>
                           <span className="text-[10px] text-blue-600/70 font-medium mt-1">Nov 15</span>
                        </div>
                     </Card>
                  </div>

                  {/* Attendance Chart */}
                  <Card title="Weekly Attendance">
                     <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={attendanceData}>
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                              <YAxis hide />
                              <Tooltip
                                 cursor={{ fill: '#f1f5f9' }}
                                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              />
                              <Bar dataKey="present" fill="#6366f1" radius={[4, 4, 4, 4]} barSize={40} background={{ fill: '#f1f5f9', radius: 4 }} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="mt-4 flex gap-4 text-xs text-slate-500 justify-center">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Present</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Absent</span>
                     </div>
                  </Card>

                  {/* Recent Fee Invoices */}
                  <Card title="Recent Invoices" action={<button onClick={() => onNavigate('fees')} className="text-sm text-indigo-600 font-medium hover:underline">View All</button>}>
                     <div className="space-y-3">
                        {childInvoices.length > 0 ? (
                           childInvoices.slice(0, 3).map(inv => (
                              <div key={inv.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                 <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                       <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'system-ui, sans-serif' }}>R</span>
                                    </div>
                                    <div>
                                       <p className="font-bold text-slate-800">{inv.type} Fee</p>
                                       <p className="text-xs text-slate-500">{inv.date} • {inv.invoiceNo}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="font-bold text-slate-800">{formatCurrency(inv.amount)}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                       {inv.status}
                                    </span>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <p className="text-slate-500 text-sm text-center py-4">No recent invoices found.</p>
                        )}
                     </div>
                  </Card>
               </div>

               {/* Right Column - Teachers & Transport */}
               <div className="space-y-6">
                  <Card title="Class Teachers">
                     <div className="space-y-4">
                        {childTeachers.map(teacher => (
                           <div key={teacher.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                              <img
                                 src={`https://ui-avatars.com/api/?name=${teacher.name}&background=random`}
                                 alt={teacher.name}
                                 className="w-10 h-10 rounded-full"
                              />
                              <div className="flex-1">
                                 <h4 className="text-sm font-bold text-slate-800">{teacher.name}</h4>
                                 <p className="text-xs text-slate-500">{teacher.subject}</p>
                              </div>
                              <button
                                 onClick={() => onNavigate('messages')}
                                 className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                              >
                                 <MessageSquare size={18} />
                              </button>
                           </div>
                        ))}
                     </div>
                     <button onClick={() => onNavigate('teachers')} className="w-full mt-4 py-2 text-sm text-center text-slate-500 hover:text-indigo-600 border border-dashed border-slate-200 rounded-lg hover:border-indigo-300 transition-all">
                        View All Teachers
                     </button>
                  </Card>

                  <Card title="Transport Status">
                     <div className="relative overflow-hidden rounded-xl bg-slate-900 text-white p-4">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                           <Bus size={100} />
                        </div>
                        <div className="relative z-10">
                           <div className="flex items-center justify-between mb-4">
                              <div>
                                 <p className="text-xs text-slate-400 uppercase font-bold">Bus Route</p>
                                 <h3 className="text-lg font-bold">Route #104</h3>
                              </div>
                              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
                                 <div className="absolute w-9 h-9 bg-emerald-500 rounded-xl animate-ping opacity-20"></div>
                                 <Bus size={16} />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                 <span className="text-slate-400">Status</span>
                                 <span className="font-medium text-emerald-400">On Time</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                 <span className="text-slate-400">ETA Home</span>
                                 <span className="font-medium">03:45 PM</span>
                              </div>
                           </div>
                           <button
                              onClick={() => onNavigate('transport')}
                              className="w-full mt-4 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-bold transition-colors"
                           >
                              Track Live Location
                           </button>
                        </div>
                     </div>
                  </Card>

                  <Card title="Upcoming Events">
                     <div className="space-y-4">
                        <div className="flex gap-3">
                           <div className="flex flex-col items-center justify-center w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                              <span className="text-[10px] font-bold uppercase">Oct</span>
                              <span className="text-lg font-bold leading-none">25</span>
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-slate-800">Science Exhibition</h4>
                              <p className="text-xs text-slate-500">School Auditorium • 10:00 AM</p>
                           </div>
                        </div>
                        <div className="flex gap-3">
                           <div className="flex flex-col items-center justify-center w-12 h-12 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                              <span className="text-[10px] font-bold uppercase">Nov</span>
                              <span className="text-lg font-bold leading-none">05</span>
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-slate-800">PTM Meeting</h4>
                              <p className="text-xs text-slate-500">Class 10-A • 08:30 AM</p>
                           </div>
                        </div>
                     </div>
                  </Card>
               </div>
            </div>
         )}
      </div>
   );
};