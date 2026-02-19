import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import {
  Users, DollarSign, GraduationCap, TrendingUp,
  ArrowDownRight, MoreHorizontal, Calendar,
  Plus, Trash2, Check, Download, Briefcase,
  BookOpen, Clock, ClipboardList, Award,
  CalendarCheck, Bus, AlertCircle, CheckCircle, ChevronRight, User
} from 'lucide-react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { UserRole, ChartDataPoint } from '../types';
import { INITIAL_STUDENTS, INITIAL_TEACHERS, INITIAL_STAFF, INITIAL_INVOICES } from '../data';
import { getGreeting, formatCurrency } from '../locale';

interface DashboardProps {
  onNavigate: (view: string) => void;
  userRole: UserRole;
}

// ==========================================
// Shared Data
// ==========================================
const financialData: ChartDataPoint[] = [
  { name: 'Jan', income: 72000, expense: 43200, students: 2400 },
  { name: 'Feb', income: 54000, expense: 25164, students: 2210 },
  { name: 'Mar', income: 36000, expense: 176400, students: 2290 },
  { name: 'Apr', income: 50040, expense: 70344, students: 2000 },
  { name: 'May', income: 34020, expense: 86400, students: 2181 },
  { name: 'Jun', income: 43020, expense: 68400, students: 2500 },
  { name: 'Jul', income: 62820, expense: 77400, students: 2100 },
];

const attendanceData = [
  { name: 'Mon', attendance: 92 },
  { name: 'Tue', attendance: 88 },
  { name: 'Wed', attendance: 95 },
  { name: 'Thu', attendance: 85 },
  { name: 'Fri', attendance: 80 },
];

// ==========================================
// Stat Card Component
// ==========================================
const StatCard = ({ title, value, trend, icon: Icon, gradient, bgLight, textColor, subtext, onClick }: any) => (
  <Card
    className={`relative overflow-hidden group transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-glow-sm' : ''}`}
    onClick={onClick}
  >
    <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-[0.08] bg-gradient-to-br ${gradient}`}></div>
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl font-extrabold text-slate-800 stat-value tracking-tight">{value}</h4>
        {trend !== undefined ? (
          <div className="flex items-center mt-2.5 gap-1.5">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${trend > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            <span className="text-[11px] text-slate-400">vs last month</span>
          </div>
        ) : (
          <div className="mt-2.5 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${subtext === 'Inactive' ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'}`}></span>
            <span className="text-xs text-slate-500 font-medium">{subtext || "Active Period"}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-${textColor.replace('text-', '')}/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        <Icon size={22} strokeWidth={2} />
      </div>
    </div>
  </Card>
);

// ==========================================
// ADMIN / SUPER_ADMIN Dashboard
// ==========================================
const AdminDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [sessions, setSessions] = useState([
    { id: 1, year: '2025-2026', status: 'Completed', currentTerm: 'Final Term' },
    { id: 2, year: '2026-2027', status: 'Active', currentTerm: 'Term 1 (Autumn)' },
    { id: 3, year: '2027-2028', status: 'Upcoming', currentTerm: 'Admission Open' },
  ]);
  const [activeSessionId, setActiveSessionId] = useState(2);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [newSessionYear, setNewSessionYear] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const greeting = useMemo(() => getGreeting(), []);

  const totalStudents = INITIAL_STUDENTS.length;
  const totalTeachers = INITIAL_TEACHERS.length;
  const totalStaff = INITIAL_STAFF.length;
  const totalRevenue = INITIAL_INVOICES.reduce((sum, inv) => inv.status === 'Paid' ? sum + inv.amount : sum, 0);

  const handleSetActiveSession = (id: number) => {
    setActiveSessionId(id);
    setSessions(sessions.map(s => ({
      ...s,
      status: s.id === id ? 'Active' : (s.id < id ? 'Completed' : 'Upcoming')
    })));
  };

  const handleAddSession = () => {
    if (!newSessionYear) return;
    const newId = Math.max(...sessions.map(s => s.id)) + 1;
    setSessions([...sessions, { id: newId, year: newSessionYear, status: 'Upcoming', currentTerm: 'Term 1' }]);
    setNewSessionYear('');
  };

  const handleDeleteSession = (id: number) => {
    if (id === activeSessionId) { alert("Cannot delete the active session."); return; }
    if (window.confirm("Are you sure you want to delete this academic session?")) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const notices = [
    { id: 1, title: 'Annual Sports Day', date: '30 Oct', content: 'Annual sports day registration is now open. All house captains must submit list of participants by Friday.' },
    { id: 2, title: 'Parent Teacher Meeting', date: '05 Nov', content: 'PTM for Grade 10 will be held on November 5th from 9 AM to 12 PM.' },
    { id: 3, title: 'Winter Vacation', date: '15 Dec', content: 'School will remain closed for winter break from Dec 20 to Jan 5.' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{greeting}, Principal Anderson 👋</h1>
          <p className="text-slate-400 mt-1">Here's what's happening at your institution today.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => alert("Generating comprehensive daily report...")} className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2 btn-lift">
            <Download size={15} /> Report
          </button>
          <button onClick={() => onNavigate('admission')} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200/50 transition-all flex items-center gap-2 btn-lift">
            <Plus size={15} /> New Admission
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div className="opacity-0 animate-fade-in-up stagger-1">
          <StatCard title="Session" value={currentSession.year} icon={Calendar} gradient="from-indigo-500 to-violet-600" bgLight="bg-indigo-50" textColor="text-indigo-600" subtext={currentSession.currentTerm} onClick={() => setIsSessionModalOpen(true)} />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-2">
          <StatCard title="Students" value={totalStudents.toString()} trend={12} icon={Users} gradient="from-blue-500 to-cyan-600" bgLight="bg-blue-50" textColor="text-blue-600" onClick={() => onNavigate('student-list')} />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-3">
          <StatCard title="Revenue" value={formatCurrency(totalRevenue)} trend={8.2} icon={DollarSign} gradient="from-emerald-500 to-teal-600" bgLight="bg-emerald-50" textColor="text-emerald-600" onClick={() => onNavigate('fees')} />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-4">
          <StatCard title="Teachers" value={totalTeachers.toString()} trend={2.4} icon={GraduationCap} gradient="from-purple-500 to-fuchsia-600" bgLight="bg-purple-50" textColor="text-purple-600" onClick={() => onNavigate('teachers')} />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-5">
          <StatCard title="Staff & HR" value={totalStaff.toString()} trend={0.5} icon={Briefcase} gradient="from-orange-500 to-amber-600" bgLight="bg-orange-50" textColor="text-orange-600" onClick={() => onNavigate('staff')} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 opacity-0 animate-fade-in-up stagger-6">
        <Card className="lg:col-span-2" title="Financial Overview" action={<button onClick={() => onNavigate('expenses')} className="text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal size={18} /></button>}>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }} itemStyle={{ fontSize: '12px', fontWeight: '600' }} />
                <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-5 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Income</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Expense</span>
          </div>
        </Card>

        <Card title="Attendance" action={<span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Live</span>}>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="attendance" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex justify-between items-center text-sm text-slate-500">
            <span className="font-medium">Avg: <strong className="text-slate-700">88%</strong></span>
            <span className="text-red-500 flex items-center gap-1 text-xs font-medium"><ArrowDownRight size={13} /> 2% vs last week</span>
          </div>
        </Card>
      </div>

      {/* Notices & Fee Collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card title="Recent Notices">
          <div className="space-y-2">
            {notices.map((notice) => (
              <div key={notice.id} onClick={() => setSelectedNotice(notice)} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-100 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 text-[10px] leading-tight text-center">{notice.date}</div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">{notice.title}</h5>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{notice.content}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Fee Collections">
          <div className="space-y-2">
            {INITIAL_INVOICES.slice(0, 3).map((inv, i) => (
              <div key={i} onClick={() => onNavigate('fees')} className="flex items-center justify-between p-3 border border-slate-50 hover:border-slate-100 rounded-xl hover:bg-slate-50/50 cursor-pointer transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 overflow-hidden flex items-center justify-center text-xs font-bold text-emerald-600">{inv.studentName.charAt(0)}</div>
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm group-hover:text-slate-900">{inv.studentName}</h5>
                    <p className="text-[11px] text-slate-400">{inv.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">+{formatCurrency(inv.amount)}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Paid</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Session Management Modal */}
      <Modal title="Manage Academic Sessions" isOpen={isSessionModalOpen} onClose={() => setIsSessionModalOpen(false)}>
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-700 mb-3">Add New Academic Year</h4>
            <div className="flex gap-2">
              <input type="text" placeholder="e.g. 2025-2026" value={newSessionYear} onChange={(e) => setNewSessionYear(e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all input-premium" />
              <button onClick={handleAddSession} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-violet-700 flex items-center gap-2 btn-lift shadow-lg shadow-indigo-200/50">
                <Plus size={15} /> Add
              </button>
            </div>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-slate-700">Existing Sessions</h4>
            {sessions.map((session) => (
              <div key={session.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${session.id === activeSessionId ? 'bg-indigo-50/80 border-indigo-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${session.id === activeSessionId ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/50' : 'bg-slate-100 text-slate-400'}`}>
                    <Calendar size={15} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${session.id === activeSessionId ? 'text-indigo-900' : 'text-slate-700'}`}>{session.year}</p>
                    <p className="text-xs text-slate-500">{session.currentTerm}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session.id === activeSessionId ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200"><Check size={12} /> Active</span>
                  ) : (
                    <button onClick={() => handleSetActiveSession(session.id)} className="text-xs font-medium text-slate-500 hover:text-indigo-600 px-2.5 py-1 hover:bg-indigo-50 rounded-lg transition-colors">Set Active</button>
                  )}
                  {session.id !== activeSessionId && (
                    <button onClick={() => handleDeleteSession(session.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
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
              <Calendar size={15} />
              <span className="font-medium">{selectedNotice.date}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-slate-600 leading-relaxed border border-slate-100 text-sm">{selectedNotice.content}</div>
            <div className="flex justify-end">
              <button onClick={() => setSelectedNotice(null)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium">Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};


// ==========================================
// TEACHER Dashboard
// ==========================================
const TeacherDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const greeting = useMemo(() => getGreeting(), []);
  const teacher = INITIAL_TEACHERS[0]; // Mock logged-in teacher
  const myStudentCount = INITIAL_STUDENTS.filter(s => s.status === 'Active').length;

  const todaySchedule = [
    { time: '08:00 – 09:00', class: 'Beginner Violin', room: 'Room A1', students: 12 },
    { time: '09:30 – 10:30', class: 'Intermediate Violin', room: 'Room A2', students: 8 },
    { time: '11:00 – 12:00', class: 'Orchestra Practice', room: 'Hall B', students: 24 },
    { time: '14:00 – 15:00', class: 'Private Lessons', room: 'Room C3', students: 3 },
  ];

  const pendingHomework = [
    { subject: 'Beginner Violin', title: 'Scales Practice Sheet', submitted: 8, total: 12, dueDate: '21 Feb 2026' },
    { subject: 'Intermediate Violin', title: 'Suzuki Book 2 - Piece 4', submitted: 5, total: 8, dueDate: '22 Feb 2026' },
  ];

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{greeting}, {teacher.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-400 mt-1">Here's your teaching overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="opacity-0 animate-fade-in-up stagger-1">
          <StatCard title="My Classes" value={teacher.classes.length.toString()} icon={BookOpen} gradient="from-indigo-500 to-violet-600" bgLight="bg-indigo-50" textColor="text-indigo-600" subtext="Active this term" onClick={() => onNavigate('classes')} />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-2">
          <StatCard title="My Students" value={myStudentCount.toString()} icon={Users} gradient="from-blue-500 to-cyan-600" bgLight="bg-blue-50" textColor="text-blue-600" subtext="Enrolled" onClick={() => onNavigate('student-list')} />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-3">
          <StatCard title="Today's Lessons" value={todaySchedule.length.toString()} icon={Clock} gradient="from-emerald-500 to-teal-600" bgLight="bg-emerald-50" textColor="text-emerald-600" subtext="Scheduled" onClick={() => onNavigate('timetable')} />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-4">
          <StatCard title="Pending Grading" value={pendingHomework.length.toString()} icon={ClipboardList} gradient="from-amber-500 to-orange-600" bgLight="bg-amber-50" textColor="text-amber-600" subtext="Needs attention" onClick={() => onNavigate('homework')} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Schedule */}
        <Card title="Today's Schedule" action={<button onClick={() => onNavigate('timetable')} className="text-xs text-indigo-600 font-medium hover:underline">View Full →</button>}>
          <div className="space-y-2">
            {todaySchedule.map((lesson, i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                <div className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 whitespace-nowrap">{lesson.time}</div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-slate-800 text-sm">{lesson.class}</h5>
                  <p className="text-xs text-slate-400">{lesson.room} · {lesson.students} students</p>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Homework */}
        <Card title="Homework to Grade" action={<button onClick={() => onNavigate('homework')} className="text-xs text-indigo-600 font-medium hover:underline">View All →</button>}>
          <div className="space-y-3">
            {pendingHomework.map((hw, i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm">{hw.title}</h5>
                    <p className="text-xs text-slate-400 mt-0.5">{hw.subject}</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">Due {hw.dueDate}</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all" style={{ width: `${(hw.submitted / hw.total) * 100}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">{hw.submitted}/{hw.total}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Class Attendance */}
      <Card title="Weekly Attendance Overview" action={<span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>This Week</span>}>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #f1f5f9' }} />
              <Bar dataKey="attendance" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};


// ==========================================
// STUDENT Dashboard
// ==========================================
const StudentDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const greeting = useMemo(() => getGreeting(), []);
  const student = INITIAL_STUDENTS[0]; // Mock logged-in student

  const todaySchedule = [
    { time: '08:00 – 09:00', subject: 'Violin Practice', teacher: 'Isaac Molelekwa', room: 'Room A1' },
    { time: '09:30 – 10:30', subject: 'Music Theory', teacher: 'Nomonde JPO', room: 'Room B2' },
    { time: '11:00 – 12:00', subject: 'Orchestra Rehearsal', teacher: 'Vusi Hlatswayo', room: 'Hall B' },
    { time: '14:00 – 15:00', subject: 'Recorder', teacher: 'Nkuli Shiburi', room: 'Room C1' },
  ];

  const upcomingExams = [
    { subject: 'Music Theory', date: '25 Feb 2026', type: 'Mid-Term' },
    { subject: 'Violin Practical', date: '28 Feb 2026', type: 'Practical' },
  ];

  const homeworkDue = [
    { subject: 'Violin', title: 'Scales Practice Sheet', dueDate: '21 Feb 2026', status: 'Pending' },
    { subject: 'Music Theory', title: 'Chord Analysis Worksheet', dueDate: '23 Feb 2026', status: 'Submitted' },
  ];

  const feeStatus = INITIAL_INVOICES.find(inv => inv.studentId === student.id);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{greeting}, {student.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-400 mt-1">Here's your academic overview. Stay on track!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="opacity-0 animate-fade-in-up stagger-1">
          <StatCard title="Attendance" value={`${student.attendance}%`} trend={3} icon={CalendarCheck} gradient="from-emerald-500 to-teal-600" bgLight="bg-emerald-50" textColor="text-emerald-600" />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-2">
          <StatCard title="Upcoming Exams" value={upcomingExams.length.toString()} icon={Award} gradient="from-amber-500 to-orange-600" bgLight="bg-amber-50" textColor="text-amber-600" subtext="This month" onClick={() => onNavigate('exams')} />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-3">
          <StatCard title="Homework Due" value={homeworkDue.filter(h => h.status === 'Pending').length.toString()} icon={ClipboardList} gradient="from-red-500 to-rose-600" bgLight="bg-red-50" textColor="text-red-600" subtext="Needs action" onClick={() => onNavigate('homework')} />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-4">
          <StatCard title="Fee Status" value={student.fee} icon={DollarSign} gradient="from-indigo-500 to-violet-600" bgLight="bg-indigo-50" textColor="text-indigo-600" subtext={feeStatus ? formatCurrency(feeStatus.amount) : 'N/A'} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Timetable */}
        <Card title="Today's Timetable" action={<button onClick={() => onNavigate('timetable')} className="text-xs text-indigo-600 font-medium hover:underline">Full Schedule →</button>}>
          <div className="space-y-2">
            {todaySchedule.map((lesson, i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                <div className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 whitespace-nowrap">{lesson.time}</div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-slate-800 text-sm">{lesson.subject}</h5>
                  <p className="text-xs text-slate-400">{lesson.teacher} · {lesson.room}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Homework & Exams */}
        <div className="space-y-5">
          <Card title="Homework Status" action={<button onClick={() => onNavigate('homework')} className="text-xs text-indigo-600 font-medium hover:underline">View All →</button>}>
            <div className="space-y-2">
              {homeworkDue.map((hw, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-slate-200 transition-all">
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm">{hw.title}</h5>
                    <p className="text-xs text-slate-400 mt-0.5">{hw.subject} · Due {hw.dueDate}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${hw.status === 'Submitted' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-amber-600 bg-amber-50 border-amber-100'}`}>
                    {hw.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Upcoming Exams" action={<button onClick={() => onNavigate('exams')} className="text-xs text-indigo-600 font-medium hover:underline">View All →</button>}>
            <div className="space-y-2">
              {upcomingExams.map((exam, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex items-center justify-center text-amber-600">
                      <Award size={18} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-800 text-sm">{exam.subject}</h5>
                      <p className="text-xs text-slate-400">{exam.type}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{exam.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Transport Info */}
      <Card title="Transport Information" action={<button onClick={() => onNavigate('transport')} className="text-xs text-indigo-600 font-medium hover:underline">Details →</button>}>
        <div className="flex items-center gap-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-blue-200/50">
            <Bus size={24} />
          </div>
          <div>
            <h5 className="font-semibold text-slate-800">Route: Zone A – Morning Pickup</h5>
            <p className="text-sm text-slate-500">Bus #12 · Driver: Mr. Sibeko · ETA: 07:15 SAST</p>
          </div>
        </div>
      </Card>
    </div>
  );
};


// ==========================================
// PARENT Dashboard
// ==========================================
const ParentDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const greeting = useMemo(() => getGreeting(), []);
  const parentName = "Robert Morgan";
  const children = INITIAL_STUDENTS.filter(s => s.parent === parentName);
  const childInvoices = INITIAL_INVOICES.filter(inv => children.some(c => c.id === inv.studentId));
  const totalOwed = childInvoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0);

  const childAttendanceData = [
    { name: 'Mon', present: 1 },
    { name: 'Tue', present: 1 },
    { name: 'Wed', present: 1 },
    { name: 'Thu', present: 0.5 },
    { name: 'Fri', present: 1 },
  ];

  const notices = [
    { id: 1, title: 'Annual Sports Day', date: '30 Oct', content: 'Registration now open.' },
    { id: 2, title: 'Parent Teacher Meeting', date: '05 Nov', content: 'Grade 10 PTM from 9 AM to 12 PM.' },
  ];

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{greeting}, {parentName.split(' ')[0]} 👋</h1>
        <p className="text-slate-400 mt-1">Track your children's progress and manage fees.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="opacity-0 animate-fade-in-up stagger-1">
          <StatCard title="My Children" value={children.length.toString()} icon={Users} gradient="from-blue-500 to-cyan-600" bgLight="bg-blue-50" textColor="text-blue-600" subtext="Enrolled" onClick={() => onNavigate('parent-portal')} />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-2">
          <StatCard title="Attendance" value={children.length > 0 ? `${children[0].attendance}%` : 'N/A'} trend={2} icon={CalendarCheck} gradient="from-emerald-500 to-teal-600" bgLight="bg-emerald-50" textColor="text-emerald-600" />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-3">
          <StatCard title="Fees Paid" value={formatCurrency(childInvoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0))} icon={CheckCircle} gradient="from-indigo-500 to-violet-600" bgLight="bg-indigo-50" textColor="text-indigo-600" subtext="This term" onClick={() => onNavigate('fees')} />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-4">
          <StatCard title="Outstanding" value={formatCurrency(totalOwed)} icon={AlertCircle} gradient="from-red-500 to-rose-600" bgLight="bg-red-50" textColor="text-red-600" subtext={totalOwed > 0 ? 'Payment needed' : 'All clear'} onClick={() => onNavigate('fees')} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Children Overview */}
        <Card title="My Children" action={<button onClick={() => onNavigate('parent-portal')} className="text-xs text-indigo-600 font-medium hover:underline">Full Details →</button>}>
          <div className="space-y-3">
            {children.map((child) => (
              <div key={child.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-all cursor-pointer" onClick={() => onNavigate('parent-portal')}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200/50">{child.name.charAt(0)}</div>
                  <div>
                    <h5 className="font-semibold text-slate-800">{child.name}</h5>
                    <p className="text-xs text-slate-400">Class {child.class} · {child.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700">{child.attendance}%</p>
                  <p className="text-[10px] text-slate-400">Attendance</p>
                </div>
              </div>
            ))}
            {children.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No children found linked to your account.</p>}
          </div>
        </Card>

        {/* Weekly Attendance */}
        <Card title="Weekly Attendance" action={<span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">This Week</span>}>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={childAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #f1f5f9' }} />
                <Bar dataKey="present" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Notices & Fees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card title="School Notices">
          <div className="space-y-2">
            {notices.map(notice => (
              <div key={notice.id} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 text-[10px] leading-tight text-center">{notice.date}</div>
                <div>
                  <h5 className="font-semibold text-slate-800 text-sm">{notice.title}</h5>
                  <p className="text-xs text-slate-400 mt-0.5">{notice.content}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Invoices" action={<button onClick={() => onNavigate('fees')} className="text-xs text-indigo-600 font-medium hover:underline">View All →</button>}>
          <div className="space-y-2">
            {childInvoices.map((inv, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-slate-50 hover:border-slate-100 rounded-xl hover:bg-slate-50/50 transition-all">
                <div>
                  <h5 className="font-semibold text-slate-800 text-sm">{inv.invoiceNo}</h5>
                  <p className="text-xs text-slate-400">{inv.type} · {inv.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${inv.status === 'Paid' ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(inv.amount)}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};


// ==========================================
// Main Dashboard Router
// ==========================================
export const Dashboard: React.FC<DashboardProps> = (props) => {
  switch (props.userRole) {
    case UserRole.SUPER_ADMIN:
    case UserRole.ADMIN:
      return <AdminDashboard {...props} />;
    case UserRole.TEACHER:
      return <TeacherDashboard {...props} />;
    case UserRole.STUDENT:
      return <StudentDashboard {...props} />;
    case UserRole.PARENT:
      return <ParentDashboard {...props} />;
    default:
      return <AdminDashboard {...props} />;
  }
};