import React, { useState, useEffect } from 'react';
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
import { Menu, Bell, Search, ChevronDown, ShieldAlert, GraduationCap, Users, User, Shield, LogOut, Loader2, Settings, HelpCircle, FileText } from 'lucide-react';
import { Card } from './components/ui/Card';

// Login Component
const LoginScreen = ({ onLogin }: { onLogin: (role: UserRole) => void }) => {
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

  const handleRoleClick = (role: UserRole) => {
    setLoadingRole(role);
    // Simulate network delay for realism
    setTimeout(() => {
      onLogin(role);
    }, 800);
  };

  const roles = [
    { role: UserRole.SUPER_ADMIN, label: 'Super Admin', icon: ShieldAlert, color: 'bg-red-500', desc: 'Full Access' },
    { role: UserRole.ADMIN, label: 'School Admin', icon: Shield, color: 'bg-indigo-600', desc: 'Manage Operations' },
    { role: UserRole.TEACHER, label: 'Teacher', icon: GraduationCap, color: 'bg-emerald-500', desc: 'Class & Exams' },
    { role: UserRole.STUDENT, label: 'Student', icon: User, color: 'bg-blue-500', desc: 'My Portal' },
    { role: UserRole.PARENT, label: 'Parent', icon: Users, color: 'bg-amber-500', desc: 'Kids & Fees' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 -z-10"></div>
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-indigo-200 mx-auto mb-4">
            E
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome to Edunets365</h1>
          <p className="text-slate-500">Select a demo account to proceed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((item) => {
            const Icon = item.icon;
            const isLoading = loadingRole === item.role;
            return (
              <Card 
                key={item.role} 
                className={`cursor-pointer group hover:border-indigo-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden ${isLoading ? 'border-indigo-500 ring-2 ring-indigo-200' : ''}`}
                onClick={() => !loadingRole && handleRoleClick(item.role)}
              >
                {isLoading && (
                   <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-20">
                      <Loader2 className="animate-spin text-indigo-600" size={32} />
                   </div>
                )}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{item.label}</h3>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-xs text-slate-400">
                &copy; 2026 Edunets365 School Management System. <br/>
                Designed for modern educational institutions.
            </p>
        </div>
      </div>
    </div>
  );
};

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

  // Login Handler
  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    // Redirect parent immediately to parent-portal
    if (role === UserRole.PARENT) {
      setActiveView('parent-portal');
    } else {
      setActiveView('dashboard');
    }
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
    // On mobile, close sidebar when navigating
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
      if (userRole === UserRole.PARENT && activeView === 'dashboard') {
         handleNavigate('parent-portal');
      }

      const isAllowed = checkAccess(activeView);
      if (!isAllowed) {
        handleNavigate(userRole === UserRole.PARENT ? 'parent-portal' : 'dashboard');
      }
    }
  }, [userRole, isLoggedIn]);

  // Check if current view is allowed
  const checkAccess = (viewId: string) => {
    // Flatten all allowed IDs
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

    // Exceptions for profile pages that might not be in the sidebar explicitly but accessible
    if (viewId === 'teacher-profile') return true;
    if (viewId === 'student-profile') return true; // Accessible via drill-down
    if (viewId === 'parent-portal' && userRole === UserRole.PARENT) return true;

    return allowedIds.has(viewId);
  };

  // Router Logic - Passing userRole to components for granular RBAC
  const renderContent = () => {
    if (!checkAccess(activeView)) {
       return (
         <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6">
               <ShieldAlert size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
            <p className="text-slate-500 max-w-md">
              You do not have permission to view the <strong>{activeView}</strong> module with your current role ({userRole.replace('_', ' ')}).
            </p>
            <button 
              onClick={() => handleNavigate(userRole === UserRole.PARENT ? 'parent-portal' : 'dashboard')}
              className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Return to Home
            </button>
         </div>
       );
    }

    switch (activeView) {
      case 'dashboard': return <Dashboard onNavigate={handleNavigate} />;
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

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden relative selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Decorative Background Elements for Glassmorphism Context */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Sidebar - Desktop */}
      <aside 
        className={`fixed lg:relative z-30 h-screen bg-white/80 backdrop-blur-xl border-r border-white/50 shadow-xl transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0 overflow-hidden'}`}
      >
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100/50 shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200 shrink-0">
            E
          </div>
          {isSidebarOpen && (
            <span className="text-xl font-bold whitespace-nowrap">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">Edunets</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">365</span>
            </span>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isActive = activeView === item.id || (hasSubItems && item.subItems?.some(sub => sub.id === activeView));
            const isExpanded = expandedMenu === item.id;

            return (
              <div key={item.id}>
                <button 
                  onClick={() => hasSubItems ? toggleSubMenu(item.id) : handleNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </div>
                  {isSidebarOpen && hasSubItems && (
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>
                
                {/* Submenu */}
                {isSidebarOpen && hasSubItems && isExpanded && (
                  <div className="ml-9 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {item.subItems?.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleNavigate(sub.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${activeView === sub.id ? 'text-indigo-600 bg-indigo-50/50 font-medium' : 'text-slate-500 hover:text-slate-800'}`}
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

        {/* Sidebar Footer - Logout */}
        <div className="p-4 border-t border-slate-100 shrink-0">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
           >
             <LogOut size={20} className="text-slate-400 group-hover:text-red-600" />
             {isSidebarOpen && <span className="font-medium">Log Out</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-white/50 flex items-center justify-between px-4 lg:px-8 z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hidden lg:block"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-indigo-100 transition-shadow shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* RBAC Role Switcher */}
            <div className="relative">
               <button 
                 onClick={(e) => { e.stopPropagation(); setShowRoleSelector(!showRoleSelector); setShowUserMenu(false); setShowNotifications(false); }}
                 className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors"
               >
                 <ShieldAlert size={14} />
                 {userRole.replace('_', ' ')}
                 <ChevronDown size={14} />
               </button>
               
               {showRoleSelector && (
                 <>
                   <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-20 animate-in fade-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
                      <p className="text-xs font-semibold text-slate-400 px-2 py-1 mb-1">CURRENT ROLE</p>
                      {Object.values(UserRole).map(role => (
                        <button
                          key={role}
                          onClick={() => { setUserRole(role); setShowRoleSelector(false); }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${userRole === role ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          {role.replace('_', ' ')}
                        </button>
                      ))}
                      <div className="h-px bg-slate-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Log Out
                      </button>
                   </div>
                 </>
               )}
            </div>

            {/* Notifications */}
            <div className="relative">
                <button 
                    onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); setShowUserMenu(false); setShowRoleSelector(false); }}
                    className={`relative p-2 rounded-full hover:bg-white transition-colors ${showNotifications ? 'bg-white text-indigo-600' : 'text-slate-600'}`}
                >
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-20 animate-in fade-in zoom-in-95 origin-top-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center px-3 py-2 border-b border-slate-50 mb-2">
                            <h4 className="font-bold text-sm text-slate-800">Notifications</h4>
                            <button className="text-xs text-indigo-600 hover:underline">Mark all read</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-1">
                            <div className="px-3 py-3 hover:bg-slate-50 cursor-pointer rounded-lg flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                    <FileText size={14} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-700 font-medium leading-tight">New Exam Schedule Published</p>
                                    <p className="text-xs text-slate-400 mt-1">20 mins ago</p>
                                </div>
                            </div>
                            <div className="px-3 py-3 hover:bg-slate-50 cursor-pointer rounded-lg flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                    <Shield size={14} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-700 font-medium leading-tight">System Maintenance Completed</p>
                                    <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                                </div>
                            </div>
                            <div className="px-3 py-3 hover:bg-slate-50 cursor-pointer rounded-lg flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                    <User size={14} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-700 font-medium leading-tight">New Student Admission Request</p>
                                    <p className="text-xs text-slate-400 mt-1">5 hours ago</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-slate-50 mt-2 pt-2 text-center">
                            <button className="text-xs text-slate-500 hover:text-slate-800 font-medium">View All History</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
            
            {/* User Menu */}
            <div className="relative">
                <div 
                    onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); setShowNotifications(false); setShowRoleSelector(false); }}
                    className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-full hover:bg-white border border-transparent hover:border-slate-100 transition-all select-none"
                >
                    <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                        alt="User" 
                        className="w-8 h-8 rounded-full border border-slate-200"
                    />
                    <div className="hidden sm:block text-left leading-tight">
                        <p className="text-sm font-semibold text-slate-800">John Doe</p>
                        <p className="text-xs text-slate-500 capitalize">{userRole.toLowerCase().replace('_', ' ')}</p>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </div>

                {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-20 animate-in fade-in zoom-in-95 origin-top-right" onClick={(e) => e.stopPropagation()}>
                        <div className="px-3 py-2 border-b border-slate-50 mb-1 md:hidden">
                            <p className="font-semibold text-slate-800">John Doe</p>
                            <p className="text-xs text-slate-500 capitalize">{userRole.replace('_', ' ')}</p>
                        </div>
                        <button 
                            onClick={() => { handleNavigate(userRole === UserRole.STUDENT ? 'student-profile' : 'settings'); setShowUserMenu(false); }} 
                            className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <User size={16} /> My Profile
                        </button>
                        <button 
                            onClick={() => { handleNavigate('settings'); setShowUserMenu(false); }} 
                            className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Settings size={16} /> Settings
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors">
                            <HelpCircle size={16} /> Help & Support
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        <button 
                            onClick={handleLogout} 
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <LogOut size={16} /> Log Out
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
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        ></div>
      )}
    </div>
  );
};

export default App;