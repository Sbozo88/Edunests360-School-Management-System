import React, { useState, useEffect, useMemo } from 'react';
import { getGreeting } from './locale';
import { SIDEBAR_ITEMS } from './constants';
import { UserRole } from './types';
import { Dashboard } from './components/Dashboard';
import { AdmissionForm } from './components/AdmissionForm';
import { FeesInvoice } from './components/FeesInvoice';
import { StudentProfile } from './components/StudentProfile';
import { StudentList } from './components/StudentList';
import { AcademicManager } from './components/AcademicManager';
import { MessageCenter } from './components/MessageCenter';
import { ExamManager } from './components/ExamManager';
import { ExpenseManager } from './components/ExpenseManager';
import { TransportManager } from './components/TransportManager';
import { SettingsView } from './components/SettingsView';
import { TeacherList } from './components/TeacherList';
import { TeacherProfile } from './components/TeacherProfile';
import { StaffList } from './components/StaffList';
import { ParentPortal } from './components/ParentPortal';
import { AttendanceRegister } from './components/AttendanceRegister';
import { HomeworkManager } from './components/HomeworkManager';
import { Menu, Bell, Search, ChevronDown, ShieldAlert, GraduationCap, Users, User, Shield, LogOut, Loader2, Settings, HelpCircle, FileText, ChevronRight, Command } from 'lucide-react';
import { Card } from './components/ui/Card';

// ==========================================
// Login Screen — Premium Redesign
// ==========================================
const LoginScreen = ({ onLogin }: { onLogin: (role: UserRole) => void }) => {
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

  const handleRoleClick = (role: UserRole) => {
    setLoadingRole(role);
    setTimeout(() => {
      onLogin(role);
    }, 800);
  };

  const roles = [
    { role: UserRole.SUPER_ADMIN, label: 'Super Admin', icon: ShieldAlert, gradient: 'from-red-500 to-rose-600', bgLight: 'bg-red-50', textColor: 'text-red-600', desc: 'Full system access & control', shadow: 'shadow-red-200' },
    { role: UserRole.ADMIN, label: 'School Admin', icon: Shield, gradient: 'from-indigo-500 to-violet-600', bgLight: 'bg-indigo-50', textColor: 'text-indigo-600', desc: 'Manage all school operations', shadow: 'shadow-indigo-200' },
    { role: UserRole.TEACHER, label: 'Teacher', icon: GraduationCap, gradient: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50', textColor: 'text-emerald-600', desc: 'Classes, exams & homework', shadow: 'shadow-emerald-200' },
    { role: UserRole.STUDENT, label: 'Student', icon: User, gradient: 'from-blue-500 to-cyan-600', bgLight: 'bg-blue-50', textColor: 'text-blue-600', desc: 'My portal & academics', shadow: 'shadow-blue-200' },
    { role: UserRole.PARENT, label: 'Parent', icon: Users, gradient: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50', textColor: 'text-amber-600', desc: 'Track kids & manage fees', shadow: 'shadow-amber-200' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/15 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 to-cyan-400/8 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-violet-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="relative w-20 h-20 mx-auto mb-6 group">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-2xl flex items-center justify-center text-white font-extrabold text-4xl shadow-xl shadow-indigo-200/50 transform transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              E
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl opacity-30 blur-xl animate-pulse-glow -z-10"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Welcome to <span className="text-gradient-brand">Edunets</span><span className="text-gradient-accent">365</span>
          </h1>
          <p className="text-slate-500 text-lg">Select a demo account to explore the platform</p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map((item, index) => {
            const Icon = item.icon;
            const isLoading = loadingRole === item.role;
            return (
              <div
                key={item.role}
                className={`opacity-0 animate-fade-in-up stagger-${index + 1}`}
              >
                <div
                  className={`cursor-pointer group rounded-2xl bg-white border-2 p-6 transition-all duration-300 relative overflow-hidden btn-lift ${isLoading
                    ? 'border-indigo-400 ring-4 ring-indigo-100 scale-[0.98]'
                    : 'border-slate-100 hover:border-slate-200 hover:shadow-card-hover'
                    }`}
                  onClick={() => !loadingRole && handleRoleClick(item.role)}
                >
                  {/* Loading Overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20 animate-fade-in">
                      <Loader2 className="animate-spin text-indigo-600" size={28} />
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-lg ${item.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon size={26} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-slate-900 transition-colors">{item.label}</h3>
                      <p className="text-sm text-slate-400 group-hover:text-slate-500 transition-colors">{item.desc}</p>
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ChevronRight size={20} className="text-slate-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-14 text-center animate-fade-in">
          <p className="text-xs text-slate-400">
            &copy; 2026 Edunets365 School Management System <span className="mx-1.5 opacity-40">·</span> v1.0.0 <br />
            <span className="text-slate-300 mt-1 block">Designed for modern educational institutions</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Breadcrumb Helper
// ==========================================
const getBreadcrumb = (activeView: string) => {
  const map: Record<string, { parent?: string; label: string }> = {
    'dashboard': { label: 'Dashboard' },
    'admission': { parent: 'Students', label: 'New Admission' },
    'student-list': { parent: 'Students', label: 'All Students' },
    'student-profile': { parent: 'Students', label: 'Student Profile' },
    'teachers': { label: 'Teachers' },
    'teacher-profile': { parent: 'Teachers', label: 'Teacher Profile' },
    'staff': { label: 'Staff & HR' },
    'attendance': { label: 'Attendance' },
    'parent-portal': { label: 'My Children' },
    'classes': { parent: 'Academic', label: 'Classes' },
    'subjects': { parent: 'Academic', label: 'Subjects' },
    'timetable': { parent: 'Academic', label: 'Timetable' },
    'homework': { label: 'Homework' },
    'messages': { label: 'Messages' },
    'exams': { label: 'Examinations' },
    'fees': { parent: 'Finance', label: 'Invoices' },
    'expenses': { parent: 'Finance', label: 'Expenses' },
    'transport': { label: 'Transport' },
    'settings': { label: 'Settings' },
    'reports': { label: 'Reports' },
  };
  return map[activeView] || { label: activeView };
};

// ==========================================
// Main App Component
// ==========================================
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.SUPER_ADMIN);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // Dropdown States
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Time-of-day greeting (SAST timezone)
  const greeting = useMemo(() => getGreeting(), []);

  // Login Handler
  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveView('dashboard');
    setSelectedId(null);
    setShowRoleSelector(false);
    setShowUserMenu(false);
    setShowNotifications(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setShowRoleSelector(false);
      setShowUserMenu(false);
      setShowNotifications(false);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Navigation Handler
  const handleNavigate = (view: string, id: string | null = null) => {
    setActiveView(view);
    setSelectedId(id);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Filter Sidebar Items based on Role
  const filteredNavItems = SIDEBAR_ITEMS.filter(item => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(userRole);
  }).map(item => ({
    ...item,
    subItems: item.subItems?.filter(sub =>
      !sub.allowedRoles || sub.allowedRoles.includes(userRole)
    )
  }));

  // Ensure activeView is valid when role changes
  useEffect(() => {
    if (isLoggedIn) {
      const isAllowed = checkAccess(activeView);
      if (!isAllowed) {
        handleNavigate('dashboard');
      }
    }
  }, [userRole, isLoggedIn]);

  // Check if current view is allowed
  const checkAccess = (viewId: string) => {
    const allowedIds = new Set<string>();

    SIDEBAR_ITEMS.forEach(item => {
      if (!item.allowedRoles || item.allowedRoles.includes(userRole)) {
        allowedIds.add(item.id);
        if (item.subItems) {
          item.subItems.forEach(sub => {
            if (!sub.allowedRoles || sub.allowedRoles.includes(userRole)) {
              allowedIds.add(sub.id);
            }
          });
        }
      }
    });

    if (viewId === 'teacher-profile') return true;
    if (viewId === 'student-profile') return true;
    if (viewId === 'parent-portal' && userRole === UserRole.PARENT) return true;

    return allowedIds.has(viewId);
  };

  // Router Logic
  const renderContent = () => {
    if (!checkAccess(activeView)) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in-up">
          <div className="w-20 h-20 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center justify-center text-red-500 mb-6">
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 max-w-md">
            You do not have permission to view the <strong className="text-slate-700">{activeView}</strong> module with your current role ({userRole.replace('_', ' ')}).
          </p>
          <button
            onClick={() => handleNavigate('dashboard')}
            className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 btn-lift font-medium"
          >
            Return to Home
          </button>
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard': return <Dashboard onNavigate={handleNavigate} userRole={userRole} />;
      case 'admission': return <AdmissionForm onNavigate={handleNavigate} />;
      case 'student-list': return <StudentList onNavigate={handleNavigate} userRole={userRole} />;
      case 'student-profile': return <StudentProfile userRole={userRole} id={selectedId} />;
      case 'teachers': return <TeacherList onNavigate={handleNavigate} userRole={userRole} />;
      case 'teacher-profile': return <TeacherProfile userRole={userRole} id={selectedId} />;
      case 'staff': return <StaffList userRole={userRole} />;
      case 'attendance': return <AttendanceRegister />;
      case 'parent-portal': return <ParentPortal onNavigate={handleNavigate} />;
      case 'classes':
      case 'subjects':
      case 'timetable':
        return <AcademicManager view={activeView} userRole={userRole} onNavigate={handleNavigate} selectedId={selectedId} />;
      case 'homework': return <HomeworkManager userRole={userRole} />;
      case 'messages': return <MessageCenter />;
      case 'exams': return <ExamManager userRole={userRole} />;
      case 'fees': return <FeesInvoice userRole={userRole} />;
      case 'expenses': return <ExpenseManager />;
      case 'transport': return <TransportManager userRole={userRole} />;
      case 'settings': return <SettingsView view="settings" />;
      case 'reports': return <SettingsView view="reports" />;
      default: return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  const toggleSubMenu = (id: string) => {
    if (expandedMenu === id) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(id);
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const breadcrumb = getBreadcrumb(activeView);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden relative selection:bg-indigo-100 selection:text-indigo-700">

      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-500/8 via-purple-500/5 to-transparent -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* ========== Sidebar ========== */}
      <aside
        className={`fixed lg:relative z-30 h-screen glass-strong border-r border-slate-200/50 shadow-xl transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0 overflow-hidden'}`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100/50 shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200/50 shrink-0">
            E
          </div>
          {isSidebarOpen && (
            <span className="text-xl font-extrabold whitespace-nowrap tracking-tight">
              <span className="text-gradient-brand">Edunets</span>
              <span className="text-gradient-accent">365</span>
            </span>
          )}
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto custom-scrollbar">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isActive = activeView === item.id || (hasSubItems && item.subItems?.some(sub => sub.id === activeView));
            const isExpanded = expandedMenu === item.id;

            return (
              <div key={item.id}>
                <button
                  onClick={() => hasSubItems ? toggleSubMenu(item.id) : handleNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive
                    ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                >
                  {/* Active Accent Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-gradient-to-b from-indigo-500 to-violet-600"></div>
                  )}

                  <div className="flex items-center gap-3">
                    <Icon size={19} className={`transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    {isSidebarOpen && <span className="text-[13.5px]">{item.label}</span>}
                  </div>
                  {isSidebarOpen && hasSubItems && (
                    <ChevronDown size={15} className={`transition-transform duration-200 text-slate-400 ${isExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Submenu */}
                {isSidebarOpen && hasSubItems && isExpanded && (
                  <div className="ml-9 mt-0.5 space-y-0.5 animate-fade-in">
                    {item.subItems?.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleNavigate(sub.id)}
                        className={`w-full text-left px-3 py-2 text-[13px] rounded-lg transition-colors ${activeView === sub.id ? 'text-indigo-600 bg-indigo-50/50 font-medium' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          >
            <LogOut size={19} className="text-slate-400 group-hover:text-red-500" />
            {isSidebarOpen && <span className="font-medium text-[13.5px]">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* ========== Main Content ========== */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Topbar */}
        <header className="h-16 glass-strong border-b border-slate-200/50 flex items-center justify-between px-4 lg:px-6 z-20 sticky top-0 shrink-0">
          <div className="flex items-center gap-3">
            {/* Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-1.5 text-sm">
              {breadcrumb.parent && (
                <>
                  <span className="text-slate-400">{breadcrumb.parent}</span>
                  <ChevronRight size={14} className="text-slate-300" />
                </>
              )}
              <span className="font-semibold text-slate-700">{breadcrumb.label}</span>
            </div>

            {/* Search */}
            <div className="hidden lg:flex items-center bg-white border border-slate-200 rounded-xl px-3.5 py-2 w-56 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-200 transition-all shadow-sm ml-3">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder:text-slate-400"
              />
              <div className="hidden xl:flex items-center gap-0.5 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                <Command size={10} />K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* RBAC Role Switcher */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowRoleSelector(!showRoleSelector); setShowUserMenu(false); setShowNotifications(false); }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors"
              >
                <ShieldAlert size={13} />
                {userRole.replace('_', ' ')}
                <ChevronDown size={13} />
              </button>

              {showRoleSelector && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-elevated border border-slate-100 p-1.5 z-20 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                  <p className="text-[10px] font-bold text-slate-400 px-2.5 py-1.5 mb-0.5 uppercase tracking-wider">Switch Role</p>
                  {Object.values(UserRole).map(role => (
                    <button
                      key={role}
                      onClick={() => { setUserRole(role); setShowRoleSelector(false); }}
                      className={`w-full text-left px-2.5 py-2 text-sm rounded-lg transition-colors ${userRole === role ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {role.replace('_', ' ')}
                    </button>
                  ))}
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2.5 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); setShowUserMenu(false); setShowRoleSelector(false); }}
                className={`relative p-2 rounded-xl hover:bg-white transition-all ${showNotifications ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1.5 min-w-[16px] h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white leading-none">3</span>
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-elevated border border-slate-100 p-2 z-20 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center px-3 py-2 border-b border-slate-50 mb-1">
                    <h4 className="font-bold text-sm text-slate-800">Notifications</h4>
                    <button className="text-xs text-indigo-600 hover:underline font-medium">Mark all read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-0.5">
                    <div className="px-3 py-2.5 hover:bg-slate-50 cursor-pointer rounded-lg flex items-start gap-3 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                        <FileText size={14} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-700 font-medium leading-tight">New Exam Schedule Published</p>
                        <p className="text-xs text-slate-400 mt-0.5">20 mins ago</p>
                      </div>
                    </div>
                    <div className="px-3 py-2.5 hover:bg-slate-50 cursor-pointer rounded-lg flex items-start gap-3 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Shield size={14} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-700 font-medium leading-tight">System Maintenance Completed</p>
                        <p className="text-xs text-slate-400 mt-0.5">2 hours ago</p>
                      </div>
                    </div>
                    <div className="px-3 py-2.5 hover:bg-slate-50 cursor-pointer rounded-lg flex items-start gap-3 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-700 font-medium leading-tight">New Student Admission Request</p>
                        <p className="text-xs text-slate-400 mt-0.5">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-50 mt-1 pt-2 text-center">
                    <button className="text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors">View All Notifications</button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-7 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            {/* User Menu */}
            <div className="relative">
              <div
                onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); setShowNotifications(false); setShowRoleSelector(false); }}
                className="flex items-center gap-2.5 cursor-pointer p-1 pr-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all select-none"
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User"
                    className="w-8 h-8 rounded-xl border-2 border-white shadow-sm"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-sm font-semibold text-slate-800">John Doe</p>
                  <p className="text-[11px] text-slate-400 capitalize">{userRole.toLowerCase().replace('_', ' ')}</p>
                </div>
                <ChevronDown size={13} className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </div>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-elevated border border-slate-100 p-1.5 z-20 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                  <div className="px-3 py-2 border-b border-slate-50 mb-1 md:hidden">
                    <p className="font-semibold text-slate-800">John Doe</p>
                    <p className="text-xs text-slate-400 capitalize">{userRole.replace('_', ' ')}</p>
                  </div>
                  <button
                    onClick={() => { handleNavigate(userRole === UserRole.STUDENT ? 'student-profile' : 'settings'); setShowUserMenu(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <User size={15} /> My Profile
                  </button>
                  <button
                    onClick={() => { handleNavigate('settings'); setShowUserMenu(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <Settings size={15} /> Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors">
                    <HelpCircle size={15} /> Help & Support
                  </button>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto pb-10">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;