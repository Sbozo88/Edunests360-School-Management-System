import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { 
  User, BookOpen, Calendar, MapPin, Phone, Mail, 
  Clock, Edit, Save, X, Briefcase, GraduationCap, CheckCircle,
  Award, Globe
} from 'lucide-react';
import { INITIAL_TEACHERS } from '../data';
import { UserRole } from '../types';

interface TeacherProfileProps {
    userRole?: UserRole;
    id?: string | null;
}

// Helper to generate consistent mock data based on ID/Name
const getMockDetails = (id: string, name: string) => {
    // Simple hash function for deterministic random data
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + name.length;
    
    const degrees = ['Bachelor of Music', 'Master of Education', 'PhD in Music Theory', 'Diploma in Performing Arts'];
    const unis = ['Berklee College of Music', 'Royal Academy of Music', 'Juilliard School', 'Conservatory of Amsterdam'];
    const cities = ['Springfield', 'New York', 'Chicago', 'Boston', 'Seattle'];
    
    return {
        address: `${(hash * 13) % 999 + 1} Maple Avenue, ${cities[hash % cities.length]}`,
        phone: `+1 (555) ${(hash * 17) % 900 + 100}-${(hash * 23) % 9000 + 1000}`,
        dob: `19${(hash % 15) + 75}-${((hash % 12) + 1).toString().padStart(2, '0')}-${((hash % 28) + 1).toString().padStart(2, '0')}`,
        joiningDate: `20${(hash % 8) + 15}-08-01`,
        qualification: degrees[hash % degrees.length],
        university: unis[hash % unis.length],
        experience: `${(hash % 15) + 3} Years`,
        bio: `${name} is a dedicated educator with over ${(hash % 15) + 3} years of experience in music education. They obtained their ${degrees[hash % degrees.length]} from ${unis[hash % unis.length]} and have been a valuable member of our faculty since 20${(hash % 8) + 15}.`
    };
};

export const TeacherProfile: React.FC<TeacherProfileProps> = ({ userRole, id }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  // Find teacher from data
  const foundTeacher = INITIAL_TEACHERS.find(t => t.id === id) || INITIAL_TEACHERS[0];
  const mockDetails = getMockDetails(foundTeacher.id, foundTeacher.name);

  const initialData = {
      ...foundTeacher,
      ...mockDetails,
      department: 'Music Department',
      avatar: `https://ui-avatars.com/api/?name=${foundTeacher.name.replace(' ', '+')}&background=random&size=256`
  };

  const [teacher, setTeacher] = useState(initialData);

  // Update state if ID changes
  useEffect(() => {
      const newFound = INITIAL_TEACHERS.find(t => t.id === id);
      if (newFound) {
          const newMock = getMockDetails(newFound.id, newFound.name);
          setTeacher({
              ...newFound,
              ...newMock,
              department: 'Music Department',
              avatar: `https://ui-avatars.com/api/?name=${newFound.name.replace(' ', '+')}&background=random&size=256`
          });
      }
  }, [id]);

  const canEdit = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN;

  const handleInputChange = (field: string, value: any) => {
    setTeacher(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would trigger an API call to update the backend
    console.log("Saved Teacher Data:", teacher);
  };

  const handleCancel = () => {
    // Revert to initial derived data
    const original = INITIAL_TEACHERS.find(t => t.id === teacher.id) || INITIAL_TEACHERS[0];
    const originalMock = getMockDetails(original.id, original.name);
    setTeacher({
        ...original,
        ...originalMock,
        department: 'Music Department',
        avatar: `https://ui-avatars.com/api/?name=${original.name.replace(' ', '+')}&background=random&size=256`
    });
    setIsEditing(false);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'academic', label: 'Academic & Classes', icon: BookOpen },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  const InfoItem = ({ icon: Icon, label, value, isEditing, name, onChange, type = "text" }: any) => (
    <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
            <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
            {isEditing && name ? (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    className="w-full bg-white border border-indigo-200 rounded px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
            ) : (
                <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
            )}
        </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Profile Card */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Cover Image Background */}
            <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            
            <div className="px-6 pb-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end -mt-12">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <img 
                            src={teacher.avatar} 
                            alt="Profile" 
                            className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-md bg-white" 
                        />
                        <span className={`absolute bottom-2 right-2 w-5 h-5 border-2 border-white rounded-full ${teacher.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    </div>
                    
                    {/* Name & Basic Info */}
                    <div className="flex-1 w-full md:w-auto pt-2">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={teacher.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="text-2xl font-bold text-slate-900 border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-100 w-full md:w-auto"
                                    />
                                ) : (
                                    <h1 className="text-2xl font-bold text-slate-900">{teacher.name}</h1>
                                )}
                                <div className="flex flex-wrap items-center gap-3 mt-1 text-slate-500 text-sm">
                                    <span className="flex items-center gap-1">
                                        <Briefcase size={14} className="text-indigo-500"/> 
                                        {isEditing ? (
                                            <input 
                                                value={teacher.subject}
                                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                                className="border border-slate-300 rounded px-1 py-0.5 text-xs w-32"
                                            />
                                        ) : teacher.subject}
                                    </span>
                                    <span className="hidden md:inline text-slate-300">•</span>
                                    <span>{teacher.department}</span>
                                    <span className="hidden md:inline text-slate-300">•</span>
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{teacher.id}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    canEdit && (
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <Edit size={16} /> Edit Profile
                                        </button>
                                    )
                                ) : (
                                    <>
                                        <button 
                                            onClick={handleCancel}
                                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <X size={16} /> Cancel
                                        </button>
                                        <button 
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <Save size={16} /> Save Changes
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 pb-1 border-b border-slate-200">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all duration-300 font-medium whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    <tab.icon size={18} />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
                
                {activeTab === 'personal' && (
                    <Card title="Personal Details">
                         <div className="mb-8">
                            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <User size={16} className="text-indigo-600"/> Biography
                            </h4>
                            {isEditing ? (
                                <textarea 
                                    value={teacher.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none text-sm leading-relaxed min-h-[120px] bg-slate-50"
                                />
                            ) : (
                                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {teacher.bio}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem 
                                icon={Calendar} label="Date of Birth" 
                                value={teacher.dob} name="dob" 
                                isEditing={isEditing} onChange={handleInputChange} type="date"
                            />
                            <InfoItem 
                                icon={Clock} label="Date of Joining" 
                                value={teacher.joiningDate} name="joiningDate" 
                                isEditing={isEditing} onChange={handleInputChange} type="date"
                            />
                            <InfoItem 
                                icon={MapPin} label="Address" 
                                value={teacher.address} name="address" 
                                isEditing={isEditing} onChange={handleInputChange} 
                            />
                            <InfoItem 
                                icon={Phone} label="Phone Number" 
                                value={teacher.phone} name="phone" 
                                isEditing={isEditing} onChange={handleInputChange} 
                            />
                            <InfoItem 
                                icon={Mail} label="Email Address" 
                                value={teacher.email} name="email" 
                                isEditing={isEditing} onChange={handleInputChange} type="email"
                            />
                            <InfoItem 
                                icon={Globe} label="Nationality" 
                                value="South African" name="nationality" 
                                isEditing={false} onChange={handleInputChange} 
                            />
                        </div>
                    </Card>
                )}

                {activeTab === 'academic' && (
                    <div className="space-y-6">
                        <Card title="Qualifications & Experience">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem 
                                    icon={GraduationCap} label="Highest Qualification" 
                                    value={teacher.qualification} name="qualification" 
                                    isEditing={isEditing} onChange={handleInputChange} 
                                />
                                <InfoItem 
                                    icon={Award} label="University / Institute" 
                                    value={teacher.university} name="university" 
                                    isEditing={isEditing} onChange={handleInputChange} 
                                />
                                <InfoItem 
                                    icon={Briefcase} label="Teaching Experience" 
                                    value={teacher.experience} name="experience" 
                                    isEditing={isEditing} onChange={handleInputChange} 
                                />
                                <InfoItem 
                                    icon={CheckCircle} label="Specialization" 
                                    value={teacher.subject} name="subject" 
                                    isEditing={isEditing} onChange={handleInputChange} 
                                />
                            </div>
                        </Card>
                        
                        <Card title="Assigned Classes">
                            {teacher.classes && teacher.classes.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {teacher.classes.map((cls: string, index: number) => (
                                        <div key={index} className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-3 rounded-xl hover:border-indigo-300 transition-colors group">
                                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                {cls.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{cls}</p>
                                                <p className="text-xs text-slate-500">Music Dept</p>
                                            </div>
                                        </div>
                                    ))}
                                    {canEdit && (
                                        <button className="flex items-center justify-center gap-2 bg-slate-50 border border-dashed border-slate-300 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition-colors">
                                            <Edit size={16} /> Manage Classes
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    No classes assigned yet.
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <Card title="Weekly Timetable">
                         <div className="space-y-4">
                             {['Monday', 'Wednesday', 'Friday', 'Saturday'].map((day) => (
                                 <div key={day} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors border border-slate-100">
                                     <div className="w-24 shrink-0 font-bold text-slate-700 pt-1">{day}</div>
                                     <div className="flex-1 space-y-3">
                                         {day === 'Saturday' ? (
                                             <>
                                                <div className="flex gap-3 items-center">
                                                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-md font-mono">09:00 - 10:00</span>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">Beginner Violin</p>
                                                        <p className="text-xs text-slate-500">Room 204 • Block A</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 items-center">
                                                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-md font-mono">11:00 - 12:30</span>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">Orchestra Practice</p>
                                                        <p className="text-xs text-slate-500">Main Hall</p>
                                                    </div>
                                                </div>
                                             </>
                                         ) : (
                                             <div className="flex gap-3 items-center">
                                                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md font-mono">14:00 - 16:00</span>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">Individual Lessons</p>
                                                    <p className="text-xs text-slate-500">By Appointment</p>
                                                </div>
                                            </div>
                                         )}
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </Card>
                )}
            </div>

            {/* Right Column - Status & Contact */}
            <div className="space-y-6">
                <Card title="Status & Attendance">
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Employment Status</label>
                         {isEditing ? (
                             <select 
                                value={teacher.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                             >
                                 <option>Active</option>
                                 <option>On Leave</option>
                                 <option>Inactive</option>
                             </select>
                         ) : (
                            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${teacher.status === 'Active' ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${teacher.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                                <span className={`font-bold text-sm ${teacher.status === 'Active' ? 'text-emerald-700' : 'text-slate-600'}`}>
                                    {teacher.status}
                                </span>
                            </div>
                         )}
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                         <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Clock size={18}/></div>
                                 <div>
                                     <p className="text-xs text-slate-500 font-medium">Daily Shift</p>
                                     <p className="text-sm font-bold text-slate-800">08:00 - 16:00</p>
                                 </div>
                             </div>
                         </div>
                         <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={18}/></div>
                                 <div>
                                     <p className="text-xs text-slate-500 font-medium">Attendance</p>
                                     <p className="text-sm font-bold text-slate-800">98% Present</p>
                                 </div>
                             </div>
                         </div>
                    </div>
                </Card>

                <Card title="Quick Contact">
                     <div className="space-y-3">
                         <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-lg shadow-indigo-200">
                             <Mail size={18} /> Send Email
                         </button>
                         <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-medium">
                             <Phone size={18} /> Call Teacher
                         </button>
                     </div>
                </Card>
            </div>
        </div>
    </div>
  );
};