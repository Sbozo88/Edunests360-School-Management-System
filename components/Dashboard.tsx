import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { 
  Users, DollarSign, GraduationCap, TrendingUp, 
  ArrowDownRight, MoreHorizontal, Calendar,
  Plus, Trash2, Check, Download, Briefcase
} from 'lucide-react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { ChartDataPoint } from '../types';
import { INITIAL_STUDENTS, INITIAL_TEACHERS, INITIAL_STAFF, INITIAL_INVOICES } from '../data';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

const data: ChartDataPoint[] = [
  { name: 'Jan', income: 4000, expense: 2400, students: 2400 },
  { name: 'Feb', income: 3000, expense: 1398, students: 2210 },
  { name: 'Mar', income: 2000, expense: 9800, students: 2290 },
  { name: 'Apr', income: 2780, expense: 3908, students: 2000 },
  { name: 'May', income: 1890, expense: 4800, students: 2181 },
  { name: 'Jun', income: 2390, expense: 3800, students: 2500 },
  { name: 'Jul', income: 3490, expense: 4300, students: 2100 },
];

const attendanceData = [
  { name: 'Mon', attendance: 92 },
  { name: 'Tue', attendance: 88 },
  { name: 'Wed', attendance: 95 },
  { name: 'Thu', attendance: 85 },
  { name: 'Fri', attendance: 80 },
];

const StatCard = ({ title, value, trend, icon: Icon, color, subtext, onClick }: any) => (
  <Card 
    className={`relative overflow-hidden group hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer ring-offset-2 hover:ring-2 hover:ring-indigo-100' : ''}`}
    onClick={onClick}
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${color}`}></div>
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
        {trend !== undefined ? (
          <div className="flex items-center mt-2 gap-1">
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2">
             <span className={`w-2 h-2 rounded-full animate-pulse ${subtext === 'Inactive' ? 'bg-slate-400' : 'bg-emerald-500'}`}></span>
             <span className="text-xs text-slate-500 font-medium">{subtext || "Active Period"}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-20 text-slate-700 shadow-sm`}>
        <Icon size={24} />
      </div>
    </div>
  </Card>
);

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  // Session Management State
  const [sessions, setSessions] = useState([
    { id: 1, year: '2025-2026', status: 'Completed', currentTerm: 'Final Term' },
    { id: 2, year: '2026-2027', status: 'Active', currentTerm: 'Term 1 (Autumn)' },
    { id: 3, year: '2027-2028', status: 'Upcoming', currentTerm: 'Admission Open' },
  ]);
  const [activeSessionId, setActiveSessionId] = useState(2);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [newSessionYear, setNewSessionYear] = useState('');
  
  // Notice Modal
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Calculate Real Stats from Shared Data
  const totalStudents = INITIAL_STUDENTS.length;
  const totalTeachers = INITIAL_TEACHERS.length;
  const totalStaff = INITIAL_STAFF.length;
  const totalRevenue = INITIAL_INVOICES.reduce((sum, inv) => inv.status === 'Paid' ? sum + inv.amount : sum, 0);

  const handleSetActiveSession = (id: number) => {
    setActiveSessionId(id);
    const updatedSessions = sessions.map(s => ({
      ...s,
      status: s.id === id ? 'Active' : (s.id < id ? 'Completed' : 'Upcoming')
    }));
    setSessions(updatedSessions);
  };

  const handleAddSession = () => {
    if (!newSessionYear) return;
    const newId = Math.max(...sessions.map(s => s.id)) + 1;
    setSessions([...sessions, { id: newId, year: newSessionYear, status: 'Upcoming', currentTerm: 'Term 1' }]);
    setNewSessionYear('');
  };

  const handleDeleteSession = (id: number) => {
    if (id === activeSessionId) {
      alert("Cannot delete the active session.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this academic session? Data linked to this session will be archived.")) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const handleDownloadReport = () => {
      alert("Generating comprehensive daily report... Download will start shortly.");
  };

  const notices = [
      { id: 1, title: 'Annual Sports Day', date: 'Oct 30', content: 'Annual sports day registration is now open. All house captains must submit list of participants by Friday.' },
      { id: 2, title: 'Parent Teacher Meeting', date: 'Nov 05', content: 'PTM for Grade 10 will be held on November 5th from 9 AM to 12 PM.' },
      { id: 3, title: 'Winter Vacation', date: 'Dec 15', content: 'School will remain closed for winter break from Dec 20 to Jan 5.' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Welcome back, Principal Anderson. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Download size={16} /> Download Report
          </button>
          <button 
            onClick={() => onNavigate('admission')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> New Admission
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <StatCard 
          title="Academic Session" 
          value={currentSession.year} 
          icon={Calendar} 
          color="bg-indigo-500" 
          subtext={currentSession.currentTerm}
          onClick={() => setIsSessionModalOpen(true)}
        />
        <StatCard 
            title="Total Students" value={totalStudents.toString()} trend={12} icon={Users} color="bg-blue-500" 
            onClick={() => onNavigate('student-list')}
        />
        <StatCard 
            title="Total Revenue" value={`$${totalRevenue}`} trend={8.2} icon={DollarSign} color="bg-emerald-500" 
            onClick={() => onNavigate('fees')}
        />
        <StatCard 
            title="Teachers" value={totalTeachers.toString()} trend={2.4} icon={GraduationCap} color="bg-purple-500" 
            onClick={() => onNavigate('teachers')}
        />
        <StatCard 
            title="Staff & HR" value={totalStaff.toString()} trend={0.5} icon={Briefcase} color="bg-orange-500" 
            onClick={() => onNavigate('staff')}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Financial Overview" action={<button onClick={() => onNavigate('expenses')} className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20}/></button>}>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Student Attendance" action={<span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Live</span>}>
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
           </div>
           <div className="mt-4 flex justify-between items-center text-sm text-slate-500">
             <span>Avg: 88%</span>
             <span className="text-red-500 flex items-center gap-1"><ArrowDownRight size={14}/> 2% vs last week</span>
           </div>
        </Card>
      </div>

      {/* Quick Actions / Recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Recent Notices">
          <div className="space-y-4">
            {notices.map((notice) => (
              <div 
                key={notice.id} 
                onClick={() => setSelectedNotice(notice)}
                className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 text-xs">
                  {notice.date}
                </div>
                <div>
                  <h5 className="font-semibold text-slate-800 text-sm">{notice.title}</h5>
                  <p className="text-xs text-slate-500 line-clamp-1">{notice.content}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card title="Recent Fee Collections">
          <div className="space-y-4">
            {INITIAL_INVOICES.slice(0, 3).map((inv, i) => (
              <div 
                key={i} 
                onClick={() => onNavigate('fees')}
                className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-600">
                     {inv.studentName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm">{inv.studentName}</h5>
                    <p className="text-xs text-slate-500">{inv.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">+${inv.amount}</p>
                  <p className="text-xs text-slate-400">Paid</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Manage Sessions Modal */}
      <Modal 
        title="Manage Academic Sessions" 
        isOpen={isSessionModalOpen} 
        onClose={() => setIsSessionModalOpen(false)}
      >
         <div className="space-y-6">
            {/* Add New Session */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
               <h4 className="text-sm font-bold text-slate-700 mb-3">Add New Academic Year</h4>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   placeholder="e.g. 2025-2026" 
                   value={newSessionYear}
                   onChange={(e) => setNewSessionYear(e.target.value)}
                   className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                 />
                 <button 
                   onClick={handleAddSession}
                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                 >
                   <Plus size={16} /> Add
                 </button>
               </div>
            </div>

            {/* List Sessions */}
            <div className="space-y-3">
               <h4 className="text-sm font-bold text-slate-700">Existing Sessions</h4>
               {sessions.map((session) => (
                 <div key={session.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${session.id === activeSessionId ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center ${session.id === activeSessionId ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Calendar size={16} />
                       </div>
                       <div>
                          <p className={`font-bold text-sm ${session.id === activeSessionId ? 'text-indigo-900' : 'text-slate-700'}`}>{session.year}</p>
                          <p className="text-xs text-slate-500">{session.currentTerm}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       {session.id === activeSessionId ? (
                         <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                           <Check size={12} /> Active
                         </span>
                       ) : (
                         <button 
                           onClick={() => handleSetActiveSession(session.id)}
                           className="text-xs font-medium text-slate-500 hover:text-indigo-600 px-2 py-1 hover:bg-indigo-50 rounded-md transition-colors"
                         >
                           Set Active
                         </button>
                       )}
                       
                       {session.id !== activeSessionId && (
                         <button 
                           onClick={() => handleDeleteSession(session.id)}
                           className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                         >
                           <Trash2 size={14} />
                         </button>
                       )}
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </Modal>

      {/* Notice Detail Modal */}
      {selectedNotice && (
          <Modal title={selectedNotice.title} isOpen={!!selectedNotice} onClose={() => setSelectedNotice(null)}>
              <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={16}/>
                      <span>{selectedNotice.date}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl text-slate-700 leading-relaxed border border-slate-100">
                      {selectedNotice.content}
                  </div>
                  <div className="flex justify-end">
                      <button 
                        onClick={() => setSelectedNotice(null)}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                      >
                          Close
                      </button>
                  </div>
              </div>
          </Modal>
      )}
    </div>
  );
};