import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Bell, Download, FileText, Palette, Globe, Lock, User, BookOpen, GraduationCap, Phone, Mail, MapPin, Calendar, Shield } from 'lucide-react';
import { UserRole } from '../types';
import { INITIAL_STUDENTS, INITIAL_TEACHERS } from '../data';

interface SettingsViewProps {
  view: 'settings' | 'reports';
  userRole: UserRole;
}

// ==========================================
// Role-specific profile data
// ==========================================
const getProfileData = (role: UserRole) => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return { name: 'Mr. Anderson', title: 'Super Administrator', email: 'admin@edunests365.co.za', phone: '+27 11 234 5678', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' };
    case UserRole.ADMIN:
      return { name: 'Mrs. Nkosi', title: 'School Administrator', email: 'nkosi@edunests365.co.za', phone: '+27 11 234 5679', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' };
    case UserRole.TEACHER:
      return { name: INITIAL_TEACHERS[0]?.name || 'Isaac Molelekwa', title: INITIAL_TEACHERS[0]?.subject || 'Violin Trainer', email: INITIAL_TEACHERS[0]?.email || 'isaac@demo.com', phone: '+27 82 345 6789', avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(INITIAL_TEACHERS[0]?.name || 'Isaac')}&background=6366f1&color=fff&size=256` };
    case UserRole.STUDENT:
      return { name: INITIAL_STUDENTS[0]?.name || 'Alex Morgan', title: `Class ${INITIAL_STUDENTS[0]?.class || '10-A'}`, email: INITIAL_STUDENTS[0]?.email || 'alex@school.com', phone: '+27 73 456 7890', avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(INITIAL_STUDENTS[0]?.name || 'Alex')}&background=3b82f6&color=fff&size=256` };
    case UserRole.PARENT:
      return { name: 'Robert Morgan', title: `Parent of ${INITIAL_STUDENTS[0]?.name || 'Alex Morgan'}`, email: 'robert.morgan@email.co.za', phone: '+27 84 567 8901', avatar: `https://ui-avatars.com/api/?name=Robert+Morgan&background=10b981&color=fff&size=256` };
    default:
      return { name: 'User', title: 'User', email: 'user@school.com', phone: '', avatar: '' };
  }
};

// ==========================================
// Role-specific report types
// ==========================================
const getReportTypes = (role: UserRole) => {
  const allReports = [
    { name: 'Student Attendance', icon: User, gradient: 'from-blue-500 to-cyan-600', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER] },
    { name: 'Fee Collections', icon: FileText, gradient: 'from-emerald-500 to-teal-600', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
    { name: 'Exam Performance', icon: FileText, gradient: 'from-violet-500 to-purple-600', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
    { name: 'Staff Payroll', icon: FileText, gradient: 'from-orange-500 to-amber-600', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
    { name: 'Transport Usage', icon: FileText, gradient: 'from-rose-500 to-pink-600', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PARENT] },
    { name: 'My Class Report', icon: BookOpen, gradient: 'from-indigo-500 to-violet-600', roles: [UserRole.TEACHER] },
    { name: 'My Academic Report', icon: GraduationCap, gradient: 'from-blue-500 to-indigo-600', roles: [UserRole.STUDENT] },
    { name: 'My Child\'s Report', icon: User, gradient: 'from-teal-500 to-emerald-600', roles: [UserRole.PARENT] },
    { name: 'Fee Statement', icon: FileText, gradient: 'from-amber-500 to-orange-600', roles: [UserRole.PARENT, UserRole.STUDENT] },
  ];
  return allReports.filter(r => r.roles.includes(role));
};

// ==========================================
// Role-specific settings sections
// ==========================================
const getSettingsSections = (role: UserRole) => {
  const sections: { title: string; items: { icon: any; label: string; description: string; key: string; type: 'toggle' | 'select'; options?: string[]; iconBg?: string; iconColor?: string; }[] }[] = [];

  // Everyone gets General Preferences
  const generalItems: any[] = [
    { icon: Bell, label: 'Notifications', description: 'Receive email and push notifications', key: 'notifications', type: 'toggle', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: Palette, label: 'Dark Mode', description: 'Switch to dark theme', key: 'darkMode', type: 'toggle', iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
    { icon: Globe, label: 'Language', description: 'Interface language', key: 'language', type: 'select', options: ['English', 'Afrikaans', 'isiZulu', 'Sesotho'], iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  ];
  sections.push({ title: 'General Preferences', items: generalItems });

  // Admin/SuperAdmin-only: Security
  if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
    sections.push({
      title: 'Security & Administration',
      items: [
        { icon: Lock, label: 'Two-Factor Auth', description: 'Add an extra layer of security', key: 'twoFactor', type: 'toggle', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
        { icon: Shield, label: 'Admin Audit Logs', description: 'View system activity logs', key: 'auditLogs', type: 'toggle', iconBg: 'bg-red-50', iconColor: 'text-red-600' },
      ]
    });
  }

  // Teacher-only: Teaching Preferences
  if (role === UserRole.TEACHER) {
    sections.push({
      title: 'Teaching Preferences',
      items: [
        { icon: BookOpen, label: 'Auto-save Attendance', description: 'Automatically save attendance at end of session', key: 'autoSaveAttendance', type: 'toggle', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
        { icon: Calendar, label: 'Homework Reminders', description: 'Get reminders for upcoming homework deadlines', key: 'homeworkReminders', type: 'toggle', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
      ]
    });
  }

  // Parent-only: Child Monitoring
  if (role === UserRole.PARENT) {
    sections.push({
      title: 'Child Monitoring',
      items: [
        { icon: Bell, label: 'Attendance Alerts', description: 'Get notified if my child is marked absent', key: 'attendanceAlerts', type: 'toggle', iconBg: 'bg-red-50', iconColor: 'text-red-600' },
        { icon: FileText, label: 'Fee Reminders', description: 'Get reminders for upcoming fee due dates', key: 'feeReminders', type: 'toggle', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
        { icon: GraduationCap, label: 'Grade Notifications', description: 'Get notified when new grades are posted', key: 'gradeNotifications', type: 'toggle', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
      ]
    });
  }

  // Student-only: Academic Preferences
  if (role === UserRole.STUDENT) {
    sections.push({
      title: 'Academic Preferences',
      items: [
        { icon: Calendar, label: 'Exam Reminders', description: 'Get reminders before upcoming exams', key: 'examReminders', type: 'toggle', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
        { icon: BookOpen, label: 'Homework Alerts', description: 'Get notified about new homework assignments', key: 'homeworkAlerts', type: 'toggle', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
      ]
    });
  }

  return sections;
};


// ==========================================
// Main Component
// ==========================================
export const SettingsView: React.FC<SettingsViewProps> = ({ view, userRole }) => {
  const [settings, setSettings] = useState<Record<string, boolean | string>>({
    notifications: true,
    twoFactor: false,
    darkMode: false,
    language: 'English',
    auditLogs: false,
    autoSaveAttendance: true,
    homeworkReminders: true,
    attendanceAlerts: true,
    feeReminders: true,
    gradeNotifications: true,
    examReminders: true,
    homeworkAlerts: true,
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateSelect = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${enabled ? 'bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200/50' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${enabled ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'}`}></div>
    </button>
  );

  const profile = getProfileData(userRole);
  const roleName = userRole.replace('_', ' ');

  // ==========================================
  // Reports View
  // ==========================================
  if (view === 'reports') {
    const reports = getReportTypes(userRole);
    return (
      <div className="space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {(userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN) ? 'System Reports' : 'My Reports'}
          </h1>
          <p className="text-slate-400 mt-1">
            {(userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN)
              ? 'Generate and download comprehensive reports'
              : 'View and download your reports'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((rep, i) => {
            const Icon = rep.icon;
            return (
              <div key={i} className={`opacity-0 animate-fade-in-up stagger-${i + 1}`}>
                <Card className="hover:border-slate-200 cursor-pointer group hover:shadow-glow-sm transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rep.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{rep.name}</h3>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">Generate comprehensive reports for {rep.name.toLowerCase()} in PDF or Excel format.</p>
                  <button className="w-full py-2.5 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium btn-lift">
                    <Download size={15} /> Download CSV
                  </button>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // Settings View
  // ==========================================
  const settingsSections = getSettingsSections(userRole);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Account Profile */}
      <Card title="Account Profile">
        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="relative">
            <img src={profile.avatar} className="w-16 h-16 rounded-2xl shadow-md border-2 border-white object-cover" alt={profile.name} />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">{profile.name}</h4>
            <p className="text-sm text-slate-400">{profile.title}</p>
            <span className="inline-block mt-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">{roleName}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-semibold uppercase tracking-wider flex items-center gap-1"><User size={11} /> Display Name</label>
            <input type="text" value={profile.name} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 font-medium input-premium" readOnly />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-semibold uppercase tracking-wider flex items-center gap-1"><Mail size={11} /> Email</label>
            <input type="email" value={profile.email} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 font-medium input-premium" readOnly />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-semibold uppercase tracking-wider flex items-center gap-1"><Phone size={11} /> Phone</label>
            <input type="text" value={profile.phone} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 font-medium input-premium" readOnly />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-semibold uppercase tracking-wider flex items-center gap-1"><MapPin size={11} /> Timezone</label>
            <input type="text" value="Africa/Johannesburg (SAST)" className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 font-medium input-premium" readOnly />
          </div>
        </div>
      </Card>

      {/* Dynamic Settings Sections */}
      {settingsSections.map((section, sIdx) => (
        <Card key={sIdx} title={section.title}>
          <div className="space-y-1">
            {section.items.map((item, iIdx) => {
              const Icon = item.icon;
              const isLast = iIdx === section.items.length - 1;
              return (
                <div key={item.key} className={`flex justify-between items-center py-3 ${!isLast ? 'border-b border-slate-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${item.iconBg || 'bg-slate-50'} ${item.iconColor || 'text-slate-600'} flex items-center justify-center`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                    </div>
                  </div>
                  {item.type === 'toggle' ? (
                    <Toggle enabled={!!settings[item.key]} onToggle={() => toggleSetting(item.key)} />
                  ) : (
                    <select
                      value={settings[item.key] as string}
                      onChange={(e) => updateSelect(item.key, e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none"
                    >
                      {item.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
};