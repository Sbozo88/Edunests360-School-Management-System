import React, { useState } from 'react';
import { Card } from './ui/Card';
import { ToggleLeft, ToggleRight, User, Shield, Bell, Download, FileText, Palette, Globe, Lock } from 'lucide-react';

interface SettingsViewProps {
  view: 'settings' | 'reports';
}

const reportTypes = [
  { name: 'Student Attendance', icon: User, gradient: 'from-blue-500 to-cyan-600', bgLight: 'bg-blue-50' },
  { name: 'Fee Collections', icon: FileText, gradient: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50' },
  { name: 'Exam Performance', icon: FileText, gradient: 'from-violet-500 to-purple-600', bgLight: 'bg-violet-50' },
  { name: 'Staff Payroll', icon: FileText, gradient: 'from-orange-500 to-amber-600', bgLight: 'bg-orange-50' },
  { name: 'Transport Usage', icon: FileText, gradient: 'from-rose-500 to-pink-600', bgLight: 'bg-rose-50' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ view }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    twoFactor: false,
    darkMode: false,
    language: 'English',
  });

  const toggleSetting = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${enabled ? 'bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200/50' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${enabled ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'}`}></div>
    </button>
  );

  if (view === 'reports') {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Reports</h1>
          <p className="text-slate-400 mt-1">Generate and download comprehensive reports</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((rep, i) => {
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* General Preferences */}
      <Card title="General Preferences">
        <div className="space-y-1">
          <div className="flex justify-between items-center py-3 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <div>
                <span className="font-semibold text-slate-700 text-sm">Notifications</span>
                <p className="text-[11px] text-slate-400">Receive email and push notifications</p>
              </div>
            </div>
            <Toggle enabled={settings.notifications} onToggle={() => toggleSetting('notifications')} />
          </div>

          <div className="flex justify-between items-center py-3 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Lock size={18} />
              </div>
              <div>
                <span className="font-semibold text-slate-700 text-sm">Two-Factor Auth</span>
                <p className="text-[11px] text-slate-400">Add an extra layer of security</p>
              </div>
            </div>
            <Toggle enabled={settings.twoFactor} onToggle={() => toggleSetting('twoFactor')} />
          </div>

          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Palette size={18} />
              </div>
              <div>
                <span className="font-semibold text-slate-700 text-sm">Dark Mode</span>
                <p className="text-[11px] text-slate-400">Switch to dark theme</p>
              </div>
            </div>
            <Toggle enabled={settings.darkMode} onToggle={() => toggleSetting('darkMode')} />
          </div>
        </div>
      </Card>

      {/* Account Settings */}
      <Card title="Account Settings">
        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" className="w-16 h-16 rounded-2xl shadow-md border-2 border-white" />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Mr. Anderson</h4>
            <p className="text-sm text-slate-400">School Principal</p>
            <button className="text-xs text-indigo-600 font-semibold hover:underline mt-1">Change Avatar</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">Display Name</label>
            <input type="text" value="Mr. Anderson" className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 font-medium input-premium" readOnly />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">Email</label>
            <input type="email" value="principal@school.com" className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 font-medium input-premium" readOnly />
          </div>
        </div>
      </Card>
    </div>
  );
};