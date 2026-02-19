import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { INITIAL_STUDENTS, INITIAL_TEACHERS, INITIAL_STAFF } from '../data';
import { 
  Search, Filter, CalendarCheck, User, Briefcase, GraduationCap, 
  Check, X, Clock, Save, Fingerprint, Wifi, Activity, 
  RefreshCw, ShieldCheck, AlertTriangle, ScanLine, Laptop, LogIn, LogOut
} from 'lucide-react';

type Group = 'students' | 'teachers' | 'staff';
type Status = 'Present' | 'Absent' | 'Late' | 'Leave';
type ViewMode = 'biometric' | 'manual';

interface BiometricLog {
  id: string;
  name: string;
  role: string;
  time: string;
  location: string;
  status: 'Success' | 'Failed' | 'Pending';
  avatar?: string;
}

export const AttendanceRegister: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('biometric');
  const [activeGroup, setActiveGroup] = useState<Group>('teachers');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState('');
  
  // Manual Register State
  const [attendanceData, setAttendanceData] = useState<Record<string, Status>>({});

  // Biometric State
  const [logs, setLogs] = useState<BiometricLog[]>([
    { id: '1', name: 'Isaac Molelekwa', role: 'Teacher', time: '07:45:12 AM', location: 'Main Gate', status: 'Success' },
    { id: '2', name: 'Lehlohonolo Mokoena', role: 'Staff', time: '07:50:05 AM', location: 'Reception', status: 'Success' },
    { id: '3', name: 'Gloria Boyi', role: 'Teacher', time: '08:05:30 AM', location: 'Main Gate', status: 'Success' },
    { id: '4', name: 'Unknown User', role: 'Guest', time: '08:10:11 AM', location: 'Main Gate', status: 'Failed' },
  ]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [scanning, setScanning] = useState(false);

  // Derived Lists
  const getList = () => {
    switch(activeGroup) {
      case 'students': return INITIAL_STUDENTS.map(s => ({ id: s.id, name: s.name, role: s.class }));
      case 'teachers': return INITIAL_TEACHERS.map(t => ({ id: t.id, name: t.name, role: t.subject }));
      case 'staff': return INITIAL_STAFF.map(s => ({ id: s.id, name: s.name, role: s.department }));
      default: return [];
    }
  };

  const list = getList().filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase()) || 
    item.role.toLowerCase().includes(filter.toLowerCase())
  );

  // --- Biometric Simulation ---
  useEffect(() => {
    if (viewMode === 'biometric') {
        const interval = setInterval(() => {
            // Randomly simulate a new scan every 5-10 seconds
            const randomPerson = list[Math.floor(Math.random() * list.length)];
            if (randomPerson && Math.random() > 0.7) {
                const newLog: BiometricLog = {
                    id: Date.now().toString(),
                    name: randomPerson.name,
                    role: activeGroup === 'teachers' ? 'Teacher' : activeGroup === 'staff' ? 'Staff' : 'Student',
                    time: new Date().toLocaleTimeString(),
                    location: Math.random() > 0.5 ? 'Main Gate' : 'Staff Room',
                    status: 'Success'
                };
                setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
            }
        }, 5000);
        return () => clearInterval(interval);
    }
  }, [viewMode, list, activeGroup]);

  // --- Manual Handlers ---
  const markStatus = (id: string, status: Status) => {
    setAttendanceData(prev => ({ ...prev, [id]: status }));
  };

  const markAll = (status: Status) => {
    const newData: Record<string, Status> = { ...attendanceData };
    list.forEach(item => { newData[item.id] = status; });
    setAttendanceData(newData);
  };

  const handleSaveManual = () => {
    alert(`Attendance saved successfully for ${Object.keys(attendanceData).length} records.`);
  };

  const handleEnroll = () => {
      setScanning(true);
      setTimeout(() => {
          setScanning(false);
          setShowEnrollModal(false);
          alert("Biometric ID successfully linked to user profile.");
      }, 2500);
  };

  // --- Components ---
  const StatusButton = ({ id, type, icon: Icon, color, activeColor }: { id: string, type: Status, icon: any, color: string, activeColor: string }) => {
    const activeClass = attendanceData[id] === type 
        ? `${activeColor} text-white shadow-md` 
        : `bg-white border-slate-200 text-slate-400 hover:bg-slate-50`;

    return (
        <button 
            onClick={() => markStatus(id, type)}
            className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center ${activeClass}`}
            title={type}
        >
            <Icon size={16} />
        </button>
    );
  };

  const BiometricView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        {/* Device Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-none relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/20 rounded-lg"><Fingerprint size={24} className="text-white"/></div>
                        <span className="flex items-center gap-1 text-xs font-bold bg-emerald-500/20 px-2 py-1 rounded text-emerald-100 border border-emerald-500/30">
                            <Wifi size={12}/> ONLINE
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold">Main Gate</h3>
                    <p className="text-indigo-200 text-sm">Device ID: BIO-001</p>
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-indigo-100">
                        <span>Latency: 12ms</span>
                        <span>v2.4.0 Firmware</span>
                    </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            </Card>

            <Card className="bg-white border-slate-200">
                <div className="flex justify-between items-start mb-4">
                     <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Laptop size={24}/></div>
                     <span className="flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        <Activity size={12}/> ACTIVE
                     </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Staff Room</h3>
                <p className="text-slate-500 text-sm">Device ID: BIO-002</p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex -space-x-2">
                         {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>)}
                    </div>
                    <span className="text-xs text-slate-500">12 Scans / min</span>
                </div>
            </Card>

            <Card className="bg-white border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group" onClick={() => setShowEnrollModal(true)}>
                <div className="h-full flex flex-col items-center justify-center text-center py-2">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <ScanLine size={24} />
                    </div>
                    <h3 className="font-bold text-slate-800">Enroll New ID</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-[150px]">Link a staff member to biometric data</p>
                </div>
            </Card>
        </div>

        {/* Live Logs Table */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
                <Card title="Live Attendance Feed" action={<div className="flex items-center gap-2 text-xs font-bold text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> LIVE</div>}>
                    <div className="overflow-hidden">
                        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Time</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Employee</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Location</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {logs.map((log, idx) => (
                                        <tr key={log.id + idx} className={`hover:bg-slate-50 transition-colors ${idx === 0 ? 'bg-indigo-50/30' : ''}`}>
                                            <td className="p-4 font-mono text-slate-600">{log.time}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                        {log.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{log.name}</p>
                                                        <p className="text-xs text-slate-500">{log.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600">{log.location}</td>
                                            <td className="p-4">
                                                {log.status === 'Success' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                        <Check size={12}/> Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                        <AlertTriangle size={12}/> Failed
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-6">
                <Card title="Today's Stats">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">On Time</span>
                            <span className="font-bold text-emerald-600">85%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[85%]"></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Late</span>
                            <span className="font-bold text-amber-600">12%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[12%]"></div>
                        </div>

                         <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Absent</span>
                            <span className="font-bold text-red-600">3%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-[3%]"></div>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-2">Late Arrivals</h4>
                        <ul className="space-y-2">
                             <li className="flex items-center justify-between text-xs text-slate-600">
                                 <span>Sarah Connor (Teacher)</span>
                                 <span className="text-red-500 font-bold">+15m</span>
                             </li>
                             <li className="flex items-center justify-between text-xs text-slate-600">
                                 <span>John Wick (Staff)</span>
                                 <span className="text-red-500 font-bold">+45m</span>
                             </li>
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );

  const ManualView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
         <div className="space-y-6">
            <Card className="p-2">
                <div className="flex flex-col gap-1">
                    {[
                        { id: 'teachers', label: 'Teachers', icon: GraduationCap },
                        { id: 'staff', label: 'Staff & HR', icon: Briefcase },
                        { id: 'students', label: 'Students', icon: User },
                    ].map(group => (
                        <button
                            key={group.id}
                            onClick={() => setActiveGroup(group.id as Group)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeGroup === group.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <group.icon size={18} />
                            {group.label}
                        </button>
                    ))}
                </div>
            </Card>

            <Card title="Bulk Actions">
                <div className="space-y-3">
                    <button onClick={() => markAll('Present')} className="w-full py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
                        Mark All Present
                    </button>
                    <button onClick={() => markAll('Absent')} className="w-full py-2 border border-red-200 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                        Mark All Absent
                    </button>
                    <button onClick={() => setAttendanceData({})} className="w-full py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Clear Selection
                    </button>
                </div>
            </Card>
         </div>

         <div className="lg:col-span-3">
             <Card className="min-h-[600px] flex flex-col p-0 overflow-hidden">
                 <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder={`Search ${activeGroup}...`} 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
                        />
                    </div>
                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                        <Filter size={18} /> Filter
                    </button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto">
                     <table className="w-full text-left border-collapse">
                         <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                             <tr>
                                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name / ID</th>
                                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role / Dept</th>
                                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                             {list.map((item) => (
                                 <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                     <td className="p-4">
                                         <p className="font-bold text-slate-800">{item.name}</p>
                                         <p className="text-xs text-slate-500">{item.id}</p>
                                     </td>
                                     <td className="p-4">
                                         <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                                             {item.role}
                                         </span>
                                     </td>
                                     <td className="p-4">
                                         <div className="flex items-center justify-center gap-2">
                                            <StatusButton id={item.id} type="Present" icon={Check} color="border-emerald-200" activeColor="bg-emerald-500 border-emerald-600" />
                                            <StatusButton id={item.id} type="Absent" icon={X} color="border-red-200" activeColor="bg-red-500 border-red-600" />
                                            <StatusButton id={item.id} type="Late" icon={Clock} color="border-amber-200" activeColor="bg-amber-500 border-amber-600" />
                                            <StatusButton id={item.id} type="Leave" icon={CalendarCheck} color="border-blue-200" activeColor="bg-blue-500 border-blue-600" />
                                         </div>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </Card>
         </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Attendance Register</h1>
           <p className="text-slate-500">Manage daily attendance via Biometric Live Feed or Manual Entry.</p>
        </div>
        <div className="flex items-center gap-4">
           {/* Toggle */}
           <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
               <button 
                 onClick={() => setViewMode('biometric')}
                 className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${viewMode === 'biometric' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
               >
                   <Fingerprint size={16} /> Biometric Mode
               </button>
               <button 
                 onClick={() => setViewMode('manual')}
                 className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${viewMode === 'manual' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
               >
                   <LogOut size={16} className="rotate-180"/> Manual Register
               </button>
           </div>

           <div className="h-8 w-px bg-slate-300 hidden md:block"></div>

           <div className="flex items-center gap-2">
               <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 shadow-sm"
               />
               {viewMode === 'manual' && (
                <button 
                    onClick={handleSaveManual}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex items-center gap-2 transition-colors"
                >
                    <Save size={18} /> Save
                </button>
               )}
           </div>
        </div>
      </div>

      {viewMode === 'biometric' ? <BiometricView /> : <ManualView />}

      {/* Enroll Modal */}
      <Modal 
        title="Enroll Biometric ID" 
        isOpen={showEnrollModal} 
        onClose={() => setShowEnrollModal(false)}
      >
          <div className="flex flex-col items-center justify-center py-8">
              <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center mb-6 relative overflow-hidden transition-colors ${scanning ? 'border-emerald-500 bg-emerald-50' : 'border-indigo-100 bg-indigo-50'}`}>
                  <Fingerprint size={64} className={`${scanning ? 'text-emerald-500' : 'text-indigo-400'} transition-colors`} />
                  {scanning && (
                      <div className="absolute inset-0 bg-emerald-500/20 animate-pulse"></div>
                  )}
                  {/* Scan Line Animation */}
                  {scanning && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-[scan_1.5s_ease-in-out_infinite]"></div>
                  )}
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2">{scanning ? 'Scanning...' : 'Ready to Scan'}</h3>
              <p className="text-slate-500 text-center max-w-xs mb-8">
                  {scanning ? 'Please hold your finger on the sensor until completion.' : 'Select a staff member below and place their finger on the sensor.'}
              </p>

              {!scanning && (
                  <div className="w-full space-y-4">
                      <div className="w-full">
                          <label className="block text-sm font-bold text-slate-700 mb-1">Select Employee</label>
                          <select className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100">
                              <option>Select...</option>
                              {INITIAL_TEACHERS.map(t => <option key={t.id}>{t.name} (Teacher)</option>)}
                              {INITIAL_STAFF.map(s => <option key={s.id}>{s.name} (Staff)</option>)}
                          </select>
                      </div>
                      <button 
                        onClick={handleEnroll}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                      >
                          Start Scanning
                      </button>
                  </div>
              )}
          </div>
      </Modal>

      <style>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};