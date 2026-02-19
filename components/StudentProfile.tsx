import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import {
    User, BookOpen, DollarSign, Bus, Calendar,
    MapPin, Phone, Mail, Award, Clock, Download, Printer,
    Edit, Save, X, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { UserRole } from '../types';
import { INITIAL_STUDENTS } from '../data';

interface StudentProfileProps {
    userRole?: UserRole;
    id?: string | null;
}

// Mock Data structure for fallback
const mockStudentData = {
    id: 'STD-2023-001',
    name: 'Alex Morgan',
    class: 'Grade 10',
    section: 'A',
    rollNo: '24',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    guardian: 'Robert Morgan',
    email: 'alex.m@school.com',
    phone: '+1 (555) 123-4567',
    address: '42 Willow Lane, Springfield, IL',
    dob: '2008-05-15',
    gender: 'Female',
    bloodGroup: 'B+',
    attendance: 92,
    feesPending: 450
};

const examResults = [
    { subject: 'Mathematics', score: 95, grade: 'A+' },
    { subject: 'Science', score: 88, grade: 'A' },
    { subject: 'English', score: 92, grade: 'A' },
    { subject: 'History', score: 85, grade: 'B+' },
    { subject: 'Computer', score: 98, grade: 'A+' },
];

const monthlyAttendance = [
    { name: 'Jan', present: 22, total: 24 },
    { name: 'Feb', present: 20, total: 20 },
    { name: 'Mar', present: 23, total: 25 },
    { name: 'Apr', present: 21, total: 22 },
    { name: 'May', present: 19, total: 23 },
];

const weeklyAttendance = [
    { name: 'Mon', status: 'Present', hours: 6 },
    { name: 'Tue', status: 'Present', hours: 6 },
    { name: 'Wed', status: 'Late', hours: 5.5 },
    { name: 'Thu', status: 'Absent', hours: 0 },
    { name: 'Fri', status: 'Present', hours: 6 },
];

export const StudentProfile: React.FC<StudentProfileProps> = ({ userRole, id }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);

    // Find student from data or fallback to mock
    const foundStudent = INITIAL_STUDENTS.find(s => s.id === id);
    const initialData = foundStudent ? {
        ...mockStudentData,
        id: foundStudent.id,
        name: foundStudent.name,
        class: foundStudent.class.split('-')[0] || 'Grade 10',
        section: foundStudent.class.split('-')[1] || 'A',
        guardian: foundStudent.parent,
        email: foundStudent.email,
        attendance: foundStudent.attendance || 92
    } : mockStudentData;

    const [student, setStudent] = useState(initialData);

    // Update state if ID changes
    useEffect(() => {
        const newFound = INITIAL_STUDENTS.find(s => s.id === id);
        if (newFound) {
            setStudent({
                ...mockStudentData,
                id: newFound.id,
                name: newFound.name,
                class: newFound.class.split('-')[0] || 'Grade 10',
                section: newFound.class.split('-')[1] || 'A',
                guardian: newFound.parent,
                email: newFound.email,
                attendance: newFound.attendance || 92
            });
        }
    }, [id]);

    // Attendance States
    const [attendanceView, setAttendanceView] = useState<'weekly' | 'monthly'>('weekly');
    const [todaysAttendance, setTodaysAttendance] = useState<'Present' | 'Absent' | 'Late' | null>(null);

    // Check permissions for marking attendance
    const canMarkAttendance = userRole === UserRole.TEACHER || userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN;

    const handleInputChange = (field: string, value: any) => {
        setStudent(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setIsEditing(false);
        console.log("Saved Student Data:", student);
    };

    const handleCancel = () => {
        setStudent(initialData);
        setIsEditing(false);
    };

    const tabs = [
        { id: 'personal', label: 'Personal', icon: User },
        { id: 'academic', label: 'Academic', icon: BookOpen },
        { id: 'fees', label: 'Fees & Finance', icon: () => <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'system-ui' }}>R</span> },
        { id: 'transport', label: 'Transport', icon: Bus },
    ];

    const InfoItem = ({ icon: Icon, label, value, isEditing, name, onChange }: any) => (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                {isEditing && name ? (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(name, e.target.value)}
                        className="w-full bg-transparent border-b border-indigo-300 focus:border-indigo-600 outline-none text-sm font-semibold text-slate-900 pb-0.5"
                    />
                ) : (
                    <p className="text-sm font-semibold text-slate-800">{value}</p>
                )}
            </div>
        </div>
    );

    const StatRow = ({ label, value, color }: any) => (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-slate-600">{label}</span>
                <span className="text-sm font-bold text-slate-800">{value}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${color} transition-all duration-500 ease-out`} style={{ width: value.includes('%') ? value : '80%' }}></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Profile Card */}
            <Card className="border-l-4 border-l-indigo-500">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex flex-col md:flex-row gap-6 items-center w-full md:w-auto">
                        <div className="relative shrink-0">
                            <img src={student.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-lg" />
                            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div className="text-center md:text-left w-full md:w-auto">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={student.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="text-2xl font-bold text-slate-900 border-b-2 border-indigo-200 focus:border-indigo-600 outline-none bg-transparent w-full md:w-64 mb-2"
                                />
                            ) : (
                                <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
                            )}

                            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2 text-sm text-slate-500">
                                <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                                    <BookOpen size={14} />
                                    {isEditing ? (
                                        <>
                                            <input
                                                value={student.class}
                                                onChange={(e) => handleInputChange('class', e.target.value)}
                                                className="w-16 bg-transparent border-b border-slate-300 focus:border-indigo-500 outline-none"
                                            />
                                            -
                                            <input
                                                value={student.section}
                                                onChange={(e) => handleInputChange('section', e.target.value)}
                                                className="w-8 bg-transparent border-b border-slate-300 focus:border-indigo-500 outline-none"
                                            />
                                        </>
                                    ) : (
                                        `${student.class} - ${student.section}`
                                    )}
                                </span>
                                <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                                    Roll: {isEditing ? (
                                        <input
                                            value={student.rollNo}
                                            onChange={(e) => handleInputChange('rollNo', e.target.value)}
                                            className="w-8 bg-transparent border-b border-slate-300 focus:border-indigo-500 outline-none"
                                        />
                                    ) : student.rollNo}
                                </span>
                                <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-medium">ID: {student.id}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                        {!isEditing ? (
                            <>
                                {canMarkAttendance && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors flex"
                                    >
                                        <Edit size={16} /> Edit Profile
                                    </button>
                                )}
                                <div className="flex gap-2">
                                    <button className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"><Printer size={18} /></button>
                                    <button className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"><Download size={18} /></button>
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-colors flex"
                                >
                                    <Save size={16} /> Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex"
                                >
                                    <X size={16} /> Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </Card>

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 font-medium ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-6">

                    {activeTab === 'personal' && (
                        <Card title="Personal Details">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                <InfoItem
                                    icon={Calendar} label="Date of Birth"
                                    value={student.dob} name="dob"
                                    isEditing={isEditing} onChange={handleInputChange}
                                />
                                <InfoItem
                                    icon={User} label="Gender"
                                    value={student.gender} name="gender"
                                    isEditing={isEditing} onChange={handleInputChange}
                                />
                                <InfoItem
                                    icon={User} label="Blood Group"
                                    value={student.bloodGroup} name="bloodGroup"
                                    isEditing={isEditing} onChange={handleInputChange}
                                />
                                <InfoItem
                                    icon={MapPin} label="Address"
                                    value={student.address} name="address"
                                    isEditing={isEditing} onChange={handleInputChange}
                                />
                            </div>

                            <div className="mt-8 border-t border-slate-100 pt-6">
                                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <User size={18} className="text-indigo-600" /> Guardian Information
                                </h4>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex items-center gap-4 min-w-[200px]">
                                        <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl border-4 border-white shadow-sm">
                                            {student.guardian.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Parent</p>
                                            <p className="font-bold text-slate-900">{student.guardian}</p>
                                            <p className="text-xs text-indigo-600 cursor-pointer hover:underline">View Portal Profile</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        <div className="bg-white p-3 rounded-lg border border-slate-100">
                                            <p className="text-xs text-slate-400 mb-1">Phone Contact</p>
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <Phone size={14} className="text-slate-400" />
                                                {isEditing ? (
                                                    <input
                                                        value={student.phone}
                                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                                        className="bg-transparent border-b border-indigo-200 w-full outline-none"
                                                    />
                                                ) : student.phone}
                                            </div>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-slate-100">
                                            <p className="text-xs text-slate-400 mb-1">Email Address</p>
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <Mail size={14} className="text-slate-400" />
                                                {isEditing ? (
                                                    <input
                                                        value={student.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        className="bg-transparent border-b border-indigo-200 w-full outline-none"
                                                    />
                                                ) : student.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'academic' && (
                        <>
                            <Card>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-slate-800">Attendance Overview</h3>
                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setAttendanceView('weekly')}
                                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${attendanceView === 'weekly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Weekly
                                        </button>
                                        <button
                                            onClick={() => setAttendanceView('monthly')}
                                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${attendanceView === 'monthly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Monthly
                                        </button>
                                    </div>
                                </div>

                                <div className="h-64 w-full mb-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={attendanceView === 'weekly' ? weeklyAttendance : monthlyAttendance}>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey={attendanceView === 'weekly' ? 'hours' : 'present'} fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Detailed History Table */}
                                {attendanceView === 'weekly' && (
                                    <div className="border-t border-slate-100 pt-6">
                                        <h4 className="text-sm font-semibold text-slate-700 mb-4">Detailed Breakdown (Last 7 Days)</h4>
                                        <div className="space-y-3">
                                            {weeklyAttendance.map((day, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                    <span className="font-medium text-slate-700">{day.name}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-slate-500">{day.hours} Hours</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${day.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                                                                day.status === 'Absent' ? 'bg-red-100 text-red-700' :
                                                                    'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {day.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>

                            <Card title="Recent Examination Results">
                                <div className="overflow-hidden rounded-xl border border-slate-100">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                            <tr>
                                                <th className="px-4 py-3">Subject</th>
                                                <th className="px-4 py-3">Score</th>
                                                <th className="px-4 py-3">Grade</th>
                                                <th className="px-4 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {examResults.map((res, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-3 font-medium text-slate-800">{res.subject}</td>
                                                    <td className="px-4 py-3">{res.score}/100</td>
                                                    <td className="px-4 py-3 font-bold text-indigo-600">{res.grade}</td>
                                                    <td className="px-4 py-3"><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">Pass</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </>
                    )}
                    {activeTab === 'fees' && (
                        <Card title="Fee Payment History">
                            {/* Reuse FeesInvoice Logic or simplified version */}
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6 flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-800 font-medium">Outstanding Balance</p>
                                    {isEditing ? (
                                        <div className="flex items-center gap-1">
                                            <span className="text-2xl font-bold text-yellow-900">$</span>
                                            <input
                                                type="number"
                                                value={student.feesPending}
                                                onChange={(e) => handleInputChange('feesPending', e.target.value)}
                                                className="text-2xl font-bold text-yellow-900 bg-transparent border-b border-yellow-300 w-32 outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-2xl font-bold text-yellow-900">${student.feesPending}.00</p>
                                    )}
                                </div>
                                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700">Pay Now</button>
                            </div>
                            {/* Table would go here */}
                            <p className="text-slate-500 text-sm">Invoice history table would be displayed here.</p>
                        </Card>
                    )}

                    {activeTab === 'transport' && (
                        <Card title="Transport Details">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                <InfoItem icon={Bus} label="Route Name" value="Route 5 - North City" />
                                <InfoItem icon={Bus} label="Bus Number" value="BUS-204" />
                                <InfoItem icon={User} label="Driver Name" value="Mr. James Bond" />
                                <InfoItem icon={Phone} label="Driver Contact" value="+1 (555) 999-0070" />
                                <InfoItem icon={Clock} label="Pickup Time" value="07:45 AM" />
                                <InfoItem icon={Clock} label="Drop Time" value="03:30 PM" />
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Column (Widgets) */}
                <div className="space-y-6">

                    {/* Mark Attendance Widget - Visible to Teachers/Admins */}
                    {canMarkAttendance && (
                        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                            <div className="mb-4">
                                <h3 className="font-bold text-lg">Mark Attendance</h3>
                                <p className="text-indigo-100 text-xs">For Today: {new Date().toLocaleDateString()}</p>
                            </div>

                            {!todaysAttendance ? (
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => setTodaysAttendance('Present')}
                                        className="flex flex-col items-center justify-center p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all border border-white/10"
                                    >
                                        <CheckCircle size={24} className="mb-1 text-emerald-300" />
                                        <span className="text-xs font-semibold">Present</span>
                                    </button>
                                    <button
                                        onClick={() => setTodaysAttendance('Absent')}
                                        className="flex flex-col items-center justify-center p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all border border-white/10"
                                    >
                                        <XCircle size={24} className="mb-1 text-red-300" />
                                        <span className="text-xs font-semibold">Absent</span>
                                    </button>
                                    <button
                                        onClick={() => setTodaysAttendance('Late')}
                                        className="flex flex-col items-center justify-center p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all border border-white/10"
                                    >
                                        <Clock size={24} className="mb-1 text-amber-300" />
                                        <span className="text-xs font-semibold">Late</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-white/10 rounded-xl border border-white/20">
                                    <p className="text-sm font-medium mb-1 opacity-80">Marked as</p>
                                    <p className={`text-2xl font-bold ${todaysAttendance === 'Present' ? 'text-emerald-300' :
                                            todaysAttendance === 'Absent' ? 'text-red-300' : 'text-amber-300'
                                        }`}>
                                        {todaysAttendance}
                                    </p>
                                    <button
                                        onClick={() => setTodaysAttendance(null)}
                                        className="text-xs text-white/60 hover:text-white mt-2 underline"
                                    >
                                        Change Status
                                    </button>
                                </div>
                            )}
                        </Card>
                    )}

                    <Card title="Performance Stats">
                        <div className="space-y-4">
                            <StatRow label="Attendance" value={`${student.attendance}%`} color="bg-emerald-500" />
                            <StatRow label="Assignments" value="48/50" color="bg-blue-500" />
                            <StatRow label="Discipline Score" value="100" color="bg-purple-500" />
                        </div>
                    </Card>
                    <Card title="Timetable (Saturday)">
                        <div className="space-y-4 relative">
                            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                            {[
                                { time: '09:00 AM', subject: 'Mathematics' },
                                { time: '10:00 AM', subject: 'Physics' },
                                { time: '11:30 AM', subject: 'Computer Science' },
                            ].map((slot, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    <div className="w-4 h-4 rounded-full bg-indigo-600 border-2 border-white absolute left-0 top-1"></div>
                                    <div className="pl-6">
                                        <p className="text-xs text-slate-500 font-medium">{slot.time}</p>
                                        <p className="text-sm font-semibold text-slate-800">{slot.subject}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};