import React, { useState } from 'react';
import { Card } from './ui/Card';
import { ToggleLeft, ToggleRight, User, Shield, Bell, Download, FileText } from 'lucide-react';

interface SettingsViewProps {
  view: 'settings' | 'reports';
}

export const SettingsView: React.FC<SettingsViewProps> = ({ view }) => {
  const [settings, setSettings] = useState({
      notifications: true,
      twoFactor: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (view === 'reports') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold text-slate-900">System Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {['Student Attendance', 'Fee Collections', 'Exam Performance', 'Staff Payroll', 'Transport Usage'].map((rep, i) => (
             <Card key={i} className="hover:border-indigo-200 cursor-pointer group">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                   <FileText size={20} />
                 </div>
                 <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{rep}</h3>
               </div>
               <p className="text-sm text-slate-500 mb-4">Generate comprehensive reports for {rep.toLowerCase()} in PDF or Excel format.</p>
               <button className="w-full py-2 border border-slate-200 rounded-lg flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors">
                 <Download size={16} /> Download CSV
               </button>
             </Card>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      
      <Card title="General Preferences">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <Bell size={20} className="text-slate-400" />
               <span className="font-medium text-slate-700">Notifications</span>
            </div>
            <button onClick={() => toggleSetting('notifications')} className="transition-colors">
                {settings.notifications ? (
                    <ToggleRight size={32} className="text-indigo-600" />
                ) : (
                    <ToggleLeft size={32} className="text-slate-300" />
                )}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <Shield size={20} className="text-slate-400" />
               <span className="font-medium text-slate-700">Two-Factor Auth</span>
            </div>
             <button onClick={() => toggleSetting('twoFactor')} className="transition-colors">
                {settings.twoFactor ? (
                    <ToggleRight size={32} className="text-indigo-600" />
                ) : (
                    <ToggleLeft size={32} className="text-slate-300" />
                )}
            </button>
          </div>
        </div>
      </Card>

      <Card title="Account Settings">
        <div className="flex items-center gap-4 mb-6">
           <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" className="w-16 h-16 rounded-full" />
           <div>
             <button className="text-sm text-indigo-600 font-medium hover:underline">Change Avatar</button>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-sm text-slate-500 mb-1">Display Name</label>
             <input type="text" value="Mr. Anderson" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" readOnly />
           </div>
           <div>
             <label className="block text-sm text-slate-500 mb-1">Email</label>
             <input type="email" value="principal@school.com" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" readOnly />
           </div>
        </div>
      </Card>
    </div>
  );
};