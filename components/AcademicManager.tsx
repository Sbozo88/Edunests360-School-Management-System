import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { 
  Book, Clock, Users, Calendar, Plus, Trash2, 
  MapPin, User, Settings, Save, X, Music, Activity, 
  MoreHorizontal, ChevronDown, CheckCircle, ChevronRight, Edit,
  Mic, BookOpen, Headphones, Eraser, Palette, Search, UserPlus,
  Download, Upload, Sun, Moon, Sunrise, Drum
} from 'lucide-react';
import { INITIAL_TEACHERS as DATA_TEACHERS, INITIAL_STUDENTS } from '../data';
import { UserRole } from '../types';

interface AcademicManagerProps {
  view: string;
  userRole?: UserRole;
  onNavigate?: (view: string, id?: string) => void;
  selectedId?: string | null;
}

// --- Types ---
interface Section { id: string; name: string; }
interface Classroom { id: string; name: string; capacity: number; status: 'Active' | 'Inactive'; }
interface Teacher { id: string; name: string; specialty: string; }
interface ClassEntity { 
  id: string; 
  name: string; 
  sectionId: string; 
  teacherId: string; 
  roomId: string; 
  shift?: string; // Added Shift
}
interface Subject { 
  id: string; 
  name: string; 
  classId: string; 
  teacherId: string; 
}
interface Routine {
  id: string;
  classId: string;
  day: string;
  timeSlot: string; 
  subjectId: string;
  studentId?: string;
}

// --- Custom Icons ---
const StringInstrumentIcon = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2c-.5 0-1 .4-1 1v18c0 .6.5 1 1 1s1-.4 1-1V3c0-.6-.5-1-1-1z" />
    <path d="M9 14c-1.5 0-2.5 1-2.5 2.5S7.5 19 9 19" />
    <path d="M15 14c1.5 0 2.5 1 2.5 2.5S16.5 19 15 19" />
    <path d="M9 6c-1 0-1.5.8-1.5 1.5S8 9 9 9" />
    <path d="M15 6c1 0 1.5.8 1.5 1.5S16 9 15 9" />
  </svg>
);

const WindInstrumentIcon = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 22L22 2" />
    <circle cx="6" cy="18" r="1.5" />
    <circle cx="10" cy="14" r="1.5" />
    <circle cx="14" cy="10" r="1.5" />
    <circle cx="18" cy="6" r="1.5" />
  </svg>
);

const BrassInstrumentIcon = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 6h10" />
    <path d="M14 6l6-3v6l-6-3" />
    <path d="M10 6v6" />
    <path d="M7 6v6" />
    <path d="M14 6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
  </svg>
);

// --- Mock Data Initialization ---
const MASTER_SUBJECTS = [
  'Marimba – Practical Musicianship',
  'Recorder – Practical Musicianship',
  'Trumpet – Practical Musicianship',
  'Clarinet – Practical Musicianship',
  'Flute – Practical Musicianship',
  'Cello – Practical Musicianship',
  'Viola – Practical Musicianship',
  'Applied Dance',
  'Violin – Practical Musicianship',
  'Rudiments of Dance',
  'Rudiments of Music',
  'Ensemble Skills'
];

// Mapping central data to local structure
const INITIAL_TEACHERS: Teacher[] = DATA_TEACHERS.map(t => ({
  id: t.id,
  name: t.name,
  specialty: t.subject
}));

const INITIAL_SECTIONS: Section[] = [
  { id: 'SEC-01', name: 'Music Department' },
  { id: 'SEC-02', name: 'Dance Department' },
  { id: 'SEC-03', name: 'Theory & History' },
];

// Generate the requested 20 rooms
const generateInitialRooms = (): Classroom[] => {
    const rooms: Classroom[] = [];
    const blocks = ['A', 'B', 'C'];
    let srNo = 1;

    // Blocks A, B, C (Rooms 1-6 each)
    blocks.forEach(block => {
        for (let i = 1; i <= 6; i++) {
            rooms.push({
                id: `RM-${srNo}`,
                name: `Room ${i} Blk ${block}`,
                capacity: 30,
                status: 'Active'
            });
            srNo++;
        }
    });

    // Additional Rooms
    rooms.push({ id: `RM-${srNo++}`, name: 'Prayer Room', capacity: 30, status: 'Active' });
    rooms.push({ id: `RM-${srNo++}`, name: 'New Room', capacity: 30, status: 'Active' });

    return rooms;
};

const INITIAL_ROOMS: Classroom[] = generateInitialRooms();

const INITIAL_CLASSES: ClassEntity[] = [
  { id: 'CLS-01', name: 'Violin A', sectionId: 'SEC-01', teacherId: 'TCH-002', roomId: 'RM-2', shift: 'Morning' },
  { id: 'CLS-02', name: 'Violin B', sectionId: 'SEC-01', teacherId: 'TCH-002', roomId: 'RM-2', shift: 'Morning' },
  { id: 'CLS-03', name: 'Viola', sectionId: 'SEC-01', teacherId: 'TCH-002', roomId: 'RM-2', shift: 'Day' },
  { id: 'CLS-04', name: 'Cello', sectionId: 'SEC-01', teacherId: 'TCH-004', roomId: 'RM-1', shift: 'Day' },
  { id: 'CLS-05', name: 'Flute', sectionId: 'SEC-01', teacherId: 'TCH-001', roomId: 'RM-2', shift: 'Morning' },
  { id: 'CLS-06', name: 'Clarinet', sectionId: 'SEC-01', teacherId: 'TCH-001', roomId: 'RM-2', shift: 'Morning' },
  { id: 'CLS-07', name: 'Trumpet', sectionId: 'SEC-01', teacherId: 'TCH-005', roomId: 'RM-1', shift: 'Evening' },
  { id: 'CLS-08', name: 'Marimba', sectionId: 'SEC-01', teacherId: 'TCH-005', roomId: 'RM-1', shift: 'Evening' },
  { id: 'CLS-09', name: 'Recorder', sectionId: 'SEC-01', teacherId: 'TCH-1010', roomId: 'RM-4', shift: 'Morning' },
  { id: 'CLS-10', name: 'Music Theory I', sectionId: 'SEC-03', teacherId: 'TCH-001', roomId: 'RM-1', shift: 'Day' },
  { id: 'CLS-11', name: 'Contemporary Dance', sectionId: 'SEC-02', teacherId: 'TCH-003', roomId: 'RM-3', shift: 'Evening' },
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: 'SUB-01', name: 'Violin – Practical Musicianship', classId: 'CLS-01', teacherId: 'TCH-002' },
  { id: 'SUB-02', name: 'Ensemble Skills', classId: 'CLS-01', teacherId: 'TCH-002' },
  { id: 'SUB-03', name: 'Recorder – Practical Musicianship', classId: 'CLS-09', teacherId: 'TCH-1010' },
];

const INITIAL_ROUTINES: Routine[] = [
    { id: 'RT-001', classId: 'CLS-01', day: 'Saturday', timeSlot: '09:00 AM', subjectId: 'SUB-01', studentId: 'STD-001' }, 
    { id: 'RT-002', classId: 'CLS-01', day: 'Saturday', timeSlot: '10:00 AM', subjectId: 'SUB-01' },
    { id: 'RT-003', classId: 'CLS-01', day: 'Saturday', timeSlot: '11:00 AM', subjectId: 'SUB-02' },
    { id: 'RT-004', classId: 'CLS-01', day: 'Saturday', timeSlot: '01:00 PM', subjectId: 'SUB-01', studentId: 'STD-002' },
];

// Helper to get icon based on keywords
const getCategoryIcon = (name: string, size = 20) => {
    const lower = name.toLowerCase();
    
    // Departments
    if (lower.includes('dance') || lower.includes('movement')) return <Activity size={size} />;
    if (lower.includes('theory') || lower.includes('history') || lower.includes('reading') || lower.includes('musicianship') || lower.includes('skills')) return <BookOpen size={size} />;
    
    // Voice
    if (lower.includes('choir') || lower.includes('voice') || lower.includes('sing')) return <Mic size={size} />;
    if (lower.includes('aural') || lower.includes('listening')) return <Headphones size={size} />;
    
    // Instruments
    if (lower.includes('marimba') || lower.includes('perc') || lower.includes('drum')) return <Drum size={size} />;
    if (lower.includes('violin') || lower.includes('viola') || lower.includes('cello') || lower.includes('guitar') || lower.includes('bass') || lower.includes('string')) return <StringInstrumentIcon size={size} />;
    if (lower.includes('flute') || lower.includes('clarinet') || lower.includes('recorder') || lower.includes('oboe') || lower.includes('sax')) return <WindInstrumentIcon size={size} />;
    if (lower.includes('trumpet') || lower.includes('trombone') || lower.includes('horn') || lower.includes('tuba') || lower.includes('brass')) return <BrassInstrumentIcon size={size} />;

    return <Music size={size} />;
};

export const AcademicManager: React.FC<AcademicManagerProps> = ({ view, userRole, onNavigate, selectedId }) => {
  // --- State ---
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [classrooms, setClassrooms] = useState<Classroom[]>(INITIAL_ROOMS);
  const [teachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [classes, setClasses] = useState<ClassEntity[]>(INITIAL_CLASSES);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [routines, setRoutines] = useState<Routine[]>(INITIAL_ROUTINES);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Editing State
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  // Timetable Palette State
  const [activeTool, setActiveTool] = useState<string | 'eraser' | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<string>(''); // For assigning individuals
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Import/Export Refs
  const subjectFileInputRef = useRef<HTMLInputElement>(null);

  // Check Permissions
  const isAdmin = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN;
  const canEdit = isAdmin;

  // UI State
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [isNewSubject, setIsNewSubject] = useState(false);
  
  // Selection State
  const [selectedClassId, setSelectedClassId] = useState<string>(selectedId || classes[0]?.id || '');
  
  useEffect(() => {
      if (selectedId) setSelectedClassId(selectedId);
  }, [selectedId]);

  // Form State
  const [newItemName, setNewItemName] = useState('');
  const [newClassData, setNewClassData] = useState({ name: '', sectionId: '', teacherId: '', roomId: '', shift: 'Morning' });
  const [newSubjectData, setNewSubjectData] = useState({ name: '', teacherId: '' });
  const [newRoomData, setNewRoomData] = useState({ name: '', capacity: 30, status: 'Active' as 'Active' | 'Inactive' });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        setActiveMenuId(null);
        if (isPaletteOpen && !(e.target as Element).closest('.palette-dropdown-container')) {
            setIsPaletteOpen(false);
        }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isPaletteOpen]);

  // --- Handlers ---
  const addSection = () => {
    if (!newItemName) return;
    setSections([...sections, { id: `SEC-${Date.now()}`, name: newItemName }]);
    setNewItemName('');
    setShowSectionModal(false);
  };

  const addClassroom = () => {
    if (!newRoomData.name) return;
    setClassrooms([...classrooms, { id: `RM-${Date.now()}`, ...newRoomData }]);
    setNewRoomData({ name: '', capacity: 30, status: 'Active' });
  };

  const deleteClassroom = (id: string) => {
      if (window.confirm('Are you sure you want to delete this classroom?')) {
          setClassrooms(classrooms.filter(r => r.id !== id));
      }
  };

  const handleOpenClassModal = (cls?: ClassEntity) => {
      if (cls) {
          setEditingClassId(cls.id);
          setNewClassData({
              name: cls.name,
              sectionId: cls.sectionId,
              teacherId: cls.teacherId,
              roomId: cls.roomId,
              shift: cls.shift || 'Morning'
          });
      } else {
          setEditingClassId(null);
          setNewClassData({ name: '', sectionId: '', teacherId: '', roomId: '', shift: 'Morning' });
      }
      setShowClassModal(true);
      setActiveMenuId(null);
  };

  const handleSaveClass = () => {
    if (!newClassData.name || !newClassData.sectionId) return;

    if (editingClassId) {
        setClasses(prev => prev.map(c => c.id === editingClassId ? {
            ...c,
            ...newClassData
        } : c));
    } else {
        setClasses([...classes, { id: `CLS-${Date.now()}`, ...newClassData }]);
    }
    setShowClassModal(false);
  };

  const handleOpenSubjectModal = (sub?: Subject) => {
      if (sub) {
          setEditingSubjectId(sub.id);
          setNewSubjectData({ name: sub.name, teacherId: sub.teacherId });
          setIsNewSubject(false);
      } else {
          setEditingSubjectId(null);
          setNewSubjectData({ name: '', teacherId: '' });
          setIsNewSubject(false);
      }
      setShowSubjectModal(true);
  };

  const handleSaveSubject = () => {
    if (!newSubjectData.name || !selectedClassId) return;

    if (editingSubjectId) {
        setSubjects(prev => prev.map(s => s.id === editingSubjectId ? {
            ...s,
            name: newSubjectData.name,
            teacherId: newSubjectData.teacherId
        } : s));
    } else {
        setSubjects([...subjects, { 
            id: `SUB-${Date.now()}`, 
            name: newSubjectData.name, 
            classId: selectedClassId, 
            teacherId: newSubjectData.teacherId 
        }]);
    }
    setNewSubjectData({ name: '', teacherId: '' });
    setShowSubjectModal(false);
    setIsNewSubject(false);
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm('Delete this subject?')) {
        setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const handleDeleteClass = (id: string) => {
      if (window.confirm('Delete this class? This will also remove assigned routines and subjects.')) {
          setClasses(classes.filter(c => c.id !== id));
          setSubjects(subjects.filter(s => s.classId !== id));
          setRoutines(routines.filter(r => r.classId !== id));
      }
  };

  const handleExportSubjects = () => {
    const headers = ['ID,Name,ClassID,TeacherID'];
    const rows = subjects.map(s => `${s.id},${s.name},${s.classId},${s.teacherId}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subjects_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportSubjects = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n');
      const newSubjects: Subject[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [id, name, classId, teacherId] = line.split(',');
        
        if (name && classId) {
             newSubjects.push({
                id: id && id.startsWith('SUB-') ? id : `SUB-${Date.now() + i}`,
                name: name.trim(),
                classId: classId.trim(),
                teacherId: teacherId?.trim() || ''
             });
        }
      }

      if (newSubjects.length > 0) {
        setSubjects(prev => [...prev, ...newSubjects]);
        alert(`Successfully imported ${newSubjects.length} subjects.`);
      }
      if (subjectFileInputRef.current) subjectFileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const Modal = ({ title, children, onClose, onSave, maxWidth = "max-w-md" }: any) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} m-4 transform transition-all scale-100 flex flex-col max-h-[85vh]`}>
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-500"><X size={20}/></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
        {onSave && (
            <div className="flex justify-end gap-3 p-6 border-t border-slate-100 shrink-0 bg-slate-50 rounded-b-2xl">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={onSave} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200">Save Changes</button>
            </div>
        )}
      </div>
    </div>
  );

  const renderClassesView = () => (
    <div className="space-y-8">
      {canEdit && (
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
               <button onClick={() => setShowSectionModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-indigo-200 transition-all">
                 <Plus size={16} /> Add Section
               </button>
               <button onClick={() => setShowRoomModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-indigo-200 transition-all">
                 <MapPin size={16} /> Manage Classrooms
               </button>
            </div>
            <button onClick={() => handleOpenClassModal()} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
               <Plus size={18} /> Create New Class
            </button>
          </div>
      )}

      {sections.map(section => {
        const sectionClasses = classes.filter(c => c.sectionId === section.id);
        const SectionIcon = getCategoryIcon(section.name, 20);

        return (
          <div key={section.id} className="space-y-4">
             <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    {SectionIcon}
                </div>
                <h2 className="text-lg font-bold text-slate-800">{section.name}</h2>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{sectionClasses.length} Classes</span>
             </div>
             
             {sectionClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sectionClasses.map(cls => {
                    const teacher = teachers.find(t => t.id === cls.teacherId);
                    const room = classrooms.find(r => r.id === cls.roomId);
                    const ClassIcon = getCategoryIcon(cls.name, 24);

                    return (
                      <Card 
                        key={cls.id} 
                        className="group hover:border-indigo-300 cursor-pointer relative overflow-visible"
                        onClick={() => onNavigate && onNavigate('subjects', cls.id)} 
                      >
                        {canEdit && (
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                               <div className="relative">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === cls.id ? null : cls.id); }}
                                    className="p-1.5 bg-white shadow-sm rounded-md text-slate-400 hover:text-indigo-600"
                                  >
                                      <Settings size={14} />
                                  </button>
                                  
                                  {activeMenuId === cls.id && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                       <button onClick={(e) => { e.stopPropagation(); handleOpenClassModal(cls); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                         <Edit size={14} /> Edit Class
                                       </button>
                                       <button onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls.id); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                         <Trash2 size={14} /> Delete
                                       </button>
                                    </div>
                                  )}
                               </div>
                            </div>
                        )}

                        <div className="flex items-start justify-between mb-3">
                           <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                              {ClassIcon}
                           </div>
                           <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded">{cls.id}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">{cls.name}</h3>
                        <div className="space-y-2 mt-4">
                           <div className="flex items-center gap-2 text-sm text-slate-500">
                             <User size={14} className="text-slate-400"/>
                             <span>{teacher?.name || 'Unassigned'}</span>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-slate-500">
                             <MapPin size={14} className="text-slate-400"/>
                             <span>{room?.name || 'No Room'}</span>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-slate-500">
                             <Clock size={14} className="text-slate-400"/>
                             <span>{cls.shift || 'Morning'} Shift</span>
                           </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                          <span className="text-xs text-slate-400">View Subjects</span>
                          <span className="text-xs font-medium text-indigo-600 flex items-center gap-1">Details <ChevronRight size={12}/></span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
             ) : (
               <div className="text-center py-10 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">
                 <p className="text-slate-400">No classes in this section yet.</p>
                 {canEdit && <button onClick={() => handleOpenClassModal()} className="text-indigo-600 text-sm font-medium mt-2 hover:underline">Create one now</button>}
               </div>
             )}
          </div>
        );
      })}
    </div>
  );

  // ... (renderSubjectsView and renderTimetableView remain largely same, just including in full file output) ...
  const renderSubjectsView = () => (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
             <label className="text-sm font-bold text-slate-700 whitespace-nowrap">Select Class:</label>
             <select 
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 min-w-[200px]"
             >
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
             </select>
          </div>
          {canEdit && (
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                <button onClick={handleExportSubjects} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition-all whitespace-nowrap">
                    <Download size={16} /> Export
                </button>
                <input type="file" ref={subjectFileInputRef} onChange={handleImportSubjects} accept=".csv" className="hidden" />
                <button onClick={() => subjectFileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition-all whitespace-nowrap">
                    <Upload size={16} /> Import
                </button>
                <button onClick={() => handleOpenSubjectModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 whitespace-nowrap">
                    <Plus size={16} /> Add Subject
                </button>
            </div>
          )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.filter(s => s.classId === selectedClassId).map(subject => {
             const teacher = teachers.find(t => t.id === subject.teacherId);
             return (
               <Card key={subject.id} className="flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        {getCategoryIcon(subject.name, 24)}
                     </div>
                     {canEdit && (
                        <div className="flex gap-2">
                            <button onClick={() => handleOpenSubjectModal(subject)} className="text-slate-300 hover:text-indigo-500 transition-colors">
                                <Edit size={16} />
                            </button>
                            <button onClick={() => handleDeleteSubject(subject.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                     )}
                  </div>
                  <div className="mt-4">
                     <h3 className="text-lg font-bold text-slate-800">{subject.name}</h3>
                     <p className="text-sm text-slate-500 mt-1">Teacher: {teacher?.name || 'Unassigned'}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50">
                     <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                        <div className="bg-purple-500 h-1.5 rounded-full" style={{width: '0%'}}></div>
                     </div>
                     <p className="text-xs text-slate-400 text-right">Syllabus: 0%</p>
                  </div>
               </Card>
             );
          })}
          
          {subjects.filter(s => s.classId === selectedClassId).length === 0 && (
             <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                   <Book size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No subjects assigned</h3>
                <p className="text-slate-500">Add subjects to this class to start tracking curriculum.</p>
             </div>
          )}
       </div>
    </div>
  );

  const renderTimetableView = () => {
    // Only Saturday lessons
    const days = ['Saturday'];
    const times = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'];
    
    // Get current class details for Room Display
    const currentClass = classes.find(c => c.id === selectedClassId);
    const defaultRoom = classrooms.find(r => r.id === currentClass?.roomId);

    const handleSlotClick = (day: string, time: string) => {
        if (!canEdit) return;
        if (!activeTool) {
            alert("Please select a subject or eraser from the dropdown above first.");
            return;
        }

        if (activeTool === 'eraser') {
            setRoutines(prev => prev.filter(r => !(r.classId === selectedClassId && r.day === day && r.timeSlot === time)));
            return;
        }

        // --- Auto-Assign Logic ---
        // 1. Check if the subject exists for this class
        const subjectName = activeTool;
        let targetSubject = subjects.find(s => s.classId === selectedClassId && s.name === subjectName);
        let targetSubjectId = targetSubject?.id;

        // 2. If not, create it on the fly
        if (!targetSubject) {
            const newId = `SUB-${Date.now()}`;
            const newSubject: Subject = {
                id: newId,
                name: subjectName,
                classId: selectedClassId,
                teacherId: '' // Default unassigned
            };
            setSubjects(prev => [...prev, newSubject]);
            targetSubjectId = newId;
        }

        // 3. Assign to Routine
        setRoutines(prev => {
             // Remove existing for this slot
             const filtered = prev.filter(r => !(r.classId === selectedClassId && r.day === day && r.timeSlot === time));
             return [...filtered, {
                 id: `RT-${Date.now()}`,
                 classId: selectedClassId,
                 day,
                 timeSlot: time,
                 subjectId: targetSubjectId!,
                 studentId: activeStudentId || undefined 
             }];
        });
    };

    return (
      <div className="space-y-6">
         <div className="flex flex-col xl:flex-row justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-20">
             <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-slate-700 whitespace-nowrap">Configure Routine:</label>
                <select 
                   value={selectedClassId}
                   onChange={(e) => setSelectedClassId(e.target.value)}
                   className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg p-2.5 min-w-[200px] outline-none"
                >
                   {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
             </div>
             
             {/* Subject Palette Dropdown - Only for Admins to assign */}
             {canEdit && (
                <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 justify-end">
                    
                    {/* Student Selector Tool */}
                    <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                       <div className={`p-2 rounded-lg ${activeStudentId ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                          <UserPlus size={18} />
                       </div>
                       <select 
                          value={activeStudentId}
                          onChange={(e) => setActiveStudentId(e.target.value)}
                          className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg p-2 outline-none w-40"
                       >
                          <option value="">Whole Class</option>
                          {INITIAL_STUDENTS.map(student => (
                             <option key={student.id} value={student.id}>{student.name}</option>
                          ))}
                       </select>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        <Palette size={14} />
                        <span>Tool Palette</span>
                    </div>

                    <div className="relative palette-dropdown-container">
                        <button
                            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-all min-w-[220px] justify-between"
                        >
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                {activeTool === 'eraser' ? (
                                    <> <Eraser size={16} className="text-red-500" /> Eraser Mode </>
                                ) : activeTool ? (
                                    <> <BookOpen size={16} className="text-indigo-600" /> {activeTool} </>
                                ) : (
                                    <> <Palette size={16} className="text-slate-400" /> Select Tool... </>
                                )}
                            </span>
                            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isPaletteOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isPaletteOpen && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-50 max-h-[400px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 origin-top-right">
                                <div className="p-2 space-y-1">
                                    <button
                                        onClick={() => { setActiveTool('eraser'); setIsPaletteOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTool === 'eraser' ? 'bg-red-50 text-red-600' : 'text-slate-600 hover:bg-red-50 hover:text-red-600'}`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500"><Eraser size={16} /></div>
                                        <span>Eraser</span>
                                    </button>
                                    
                                    <div className="h-px bg-slate-100 my-2"></div>
                                    <p className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Subjects</p>
                                    
                                    {MASTER_SUBJECTS.map(subName => {
                                        const isAssigned = subjects.some(s => s.classId === selectedClassId && s.name === subName);
                                        return (
                                            <button
                                                key={subName}
                                                onClick={() => { setActiveTool(subName); setIsPaletteOpen(false); }}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left group ${activeTool === subName ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                <div className="flex items-center gap-3 truncate">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${activeTool === subName ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                                                        {subName.charAt(0)}
                                                    </div>
                                                    <span className="truncate">{subName}</span>
                                                </div>
                                                {isAssigned && <CheckCircle size={14} className="text-emerald-500 shrink-0" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
             )}
         </div>

         {/* Visual Indicator of Active Tool */}
         {canEdit && (
             <div className="text-center">
                 {activeTool ? (
                     <span className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold ${activeTool === 'eraser' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                         {activeTool === 'eraser' ? <Eraser size={14}/> : <CheckCircle size={14}/>}
                         {activeTool === 'eraser' ? 'Eraser Active: Click a slot to clear' : `Assigning: ${activeTool}`}
                         {activeTool !== 'eraser' && activeStudentId && (
                             <span className="ml-2 pl-2 border-l border-indigo-200 text-indigo-800 flex items-center gap-1">
                                 <User size={12} /> {INITIAL_STUDENTS.find(s => s.id === activeStudentId)?.name}
                             </span>
                         )}
                     </span>
                 ) : (
                     <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-medium text-slate-500 bg-slate-100">
                         Select a subject and optionally a student to start assigning
                     </span>
                 )}
             </div>
         )}

         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header: Time + Day */}
            <div className="grid grid-cols-[120px_1fr] border-b border-slate-200">
               <div className="p-4 bg-slate-50 font-bold text-slate-400 text-xs uppercase tracking-wider border-r border-slate-200 flex items-center justify-center">Time / Day</div>
               {days.map(d => (
                  <div key={d} className="p-4 bg-slate-50 font-bold text-center text-slate-700 text-sm border-r border-slate-200 last:border-0">{d}</div>
               ))}
            </div>
            {/* Rows */}
            {times.map(time => (
               <div key={time} className="grid grid-cols-[120px_1fr] border-b border-slate-200 last:border-0">
                  <div className="p-4 text-xs font-medium text-slate-500 border-r border-slate-200 bg-slate-50/30 flex items-center justify-center">{time}</div>
                  {days.map(day => {
                     const routine = routines.find(r => r.classId === selectedClassId && r.day === day && r.timeSlot === time);
                     const subject = routine ? subjects.find(s => s.id === routine.subjectId) : null;
                     const student = routine?.studentId ? INITIAL_STUDENTS.find(s => s.id === routine.studentId) : null;
                     
                     return (
                        <div 
                           key={`${day}-${time}`} 
                           onClick={() => handleSlotClick(day, time)}
                           className={`min-h-[100px] p-1 border-r border-slate-100 last:border-0 transition-all relative group
                              ${routine ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}
                              ${canEdit ? 'cursor-pointer' : ''}
                           `}
                        >
                           {subject ? (
                              <div className={`h-full w-full border rounded-lg p-2 flex flex-col justify-center items-center text-center animate-in zoom-in duration-200 hover:shadow-md transition-shadow relative overflow-hidden ${student ? 'bg-purple-50 border-purple-200' : 'bg-indigo-100 border-indigo-200'}`}>
                                 <span className={`text-[10px] font-bold uppercase mb-1 ${student ? 'text-purple-400' : 'text-indigo-400'}`}>{time}</span>
                                 <span className={`text-xs font-bold line-clamp-2 leading-tight ${student ? 'text-purple-700' : 'text-indigo-700'}`}>{subject.name}</span>
                                 
                                 {/* Location & Student Container */}
                                 <div className="mt-2 w-full flex flex-col gap-1 items-center">
                                     {/* Room Badge */}
                                     <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-white/70 px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
                                         <MapPin size={10} className="text-slate-400" />
                                         <span className="truncate max-w-[80px]">{defaultRoom?.name || 'No Room'}</span>
                                     </div>

                                     {/* Student Badge */}
                                     {student && (
                                         <div className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-full text-[10px] font-bold text-purple-700 border border-purple-100 shadow-sm">
                                             <User size={10} /> {student.name.split(' ')[0]}
                                         </div>
                                     )}
                                 </div>

                                 {canEdit && (
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                                       <div className="w-4 h-4 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200">
                                            <X size={10} />
                                       </div>
                                    </div>
                                 )}
                              </div>
                           ) : (
                              canEdit && (
                                <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Plus size={16} className="text-slate-300" />
                                </div>
                              )
                           )}
                        </div>
                     );
                  })}
               </div>
            ))}
         </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 capitalize">{view === 'timetable' ? 'Routine Management' : `${view} Management`}</h1>
        <p className="text-slate-500">
            {view === 'classes' && 'Configure sections, classrooms, and academic classes.'}
            {view === 'subjects' && 'Assign subjects and syllabi to specific classes.'}
            {view === 'timetable' && 'View and manage weekly class routines.'}
        </p>
      </div>

      {view === 'classes' && renderClassesView()}
      {view === 'subjects' && renderSubjectsView()}
      {view === 'timetable' && renderTimetableView()}

      {/* --- MODALS --- */}
      
      {/* Add Section Modal */}
      {showSectionModal && (
        <Modal title="Add New Section" onClose={() => setShowSectionModal(false)} onSave={addSection}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Name</label>
            <input 
              type="text" 
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="e.g. Music Department, Dance" 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
        </Modal>
      )}

      {/* Manage Classrooms Modal - Updated to Wide Table View */}
      {showRoomModal && (
        <Modal 
            title="Manage Classrooms" 
            onClose={() => setShowRoomModal(false)} 
            maxWidth="max-w-4xl" // Wider modal for table
        >
          <div className="space-y-6">
              {/* Add Room Form */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Room No / Name</label>
                    <input 
                      type="text" 
                      value={newRoomData.name}
                      onChange={(e) => setNewRoomData({...newRoomData, name: e.target.value})}
                      placeholder="e.g. Room 1 Block D" 
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                    <input 
                      type="number" 
                      value={newRoomData.capacity}
                      onChange={(e) => setNewRoomData({...newRoomData, capacity: parseInt(e.target.value)})}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  </div>
                  <button 
                    onClick={addClassroom}
                    className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Add
                  </button>
              </div>

              {/* Classroom List Table */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4">Classroom List</h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                            <tr>
                                <th className="p-4 text-right w-20">Sr No</th>
                                <th className="p-4">Room No</th>
                                <th className="p-4">Capacity</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {classrooms.map((room, index) => (
                                <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-right text-slate-500 font-mono">{index + 1}</td>
                                    <td className="p-4 font-medium text-slate-800">{room.name}</td>
                                    <td className="p-4 text-slate-600">{room.capacity}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            room.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {room.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => deleteClassroom(room.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Room"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {classrooms.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">No classrooms found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
              </div>
          </div>
        </Modal>
      )}

      {/* Create/Edit Class Modal */}
      {showClassModal && (
        <Modal title={editingClassId ? "Edit Class" : "Create New Class"} onClose={() => setShowClassModal(false)} onSave={handleSaveClass}>
           <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class Name</label>
                <input 
                  type="text" 
                  value={newClassData.name}
                  onChange={(e) => setNewClassData({...newClassData, name: e.target.value})}
                  placeholder="e.g. Violin Advanced" 
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                    <select 
                      value={newClassData.sectionId}
                      onChange={(e) => setNewClassData({...newClassData, sectionId: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none"
                    >
                       <option value="">Select...</option>
                       {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Classroom</label>
                    <select 
                      value={newClassData.roomId}
                      onChange={(e) => setNewClassData({...newClassData, roomId: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none"
                    >
                       <option value="">Select...</option>
                       {classrooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Shift</label>
                    <select 
                      value={newClassData.shift}
                      onChange={(e) => setNewClassData({...newClassData, shift: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none"
                    >
                       <option value="Morning">Morning</option>
                       <option value="Day">Day</option>
                       <option value="Evening">Evening</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assign Class Teacher</label>
                    <select 
                        value={newClassData.teacherId}
                        onChange={(e) => setNewClassData({...newClassData, teacherId: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none"
                    >
                        <option value="">Select...</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>)}
                    </select>
                 </div>
              </div>
           </div>
        </Modal>
      )}

      {/* Add/Edit Subject Modal */}
      {showSubjectModal && (
         <Modal title={editingSubjectId ? "Edit Subject" : "Assign Subject to Class"} onClose={() => setShowSubjectModal(false)} onSave={handleSaveSubject}>
            <div className="space-y-4">
               
               {/* Selection Mode Toggle */}
               {!editingSubjectId && (
                   <div className="flex gap-4 p-1 bg-slate-100 rounded-lg mb-4">
                      <button 
                        onClick={() => setIsNewSubject(false)}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${!isNewSubject ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Select Existing
                      </button>
                      <button 
                        onClick={() => setIsNewSubject(true)}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${isNewSubject ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Create Custom
                      </button>
                   </div>
               )}

               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
                  {!isNewSubject && !editingSubjectId ? (
                      <select
                          value={newSubjectData.name}
                          onChange={(e) => setNewSubjectData({...newSubjectData, name: e.target.value})}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none"
                      >
                          <option value="">-- Select Subject --</option>
                          {MASTER_SUBJECTS.map(sub => (
                              <option key={sub} value={sub}>{sub}</option>
                          ))}
                      </select>
                  ) : (
                      <input 
                         type="text" 
                         value={newSubjectData.name}
                         onChange={(e) => setNewSubjectData({...newSubjectData, name: e.target.value})}
                         placeholder="e.g. Advanced Composition" 
                         className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
                      />
                  )}
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject Teacher</label>
                  <select 
                     value={newSubjectData.teacherId}
                     onChange={(e) => setNewSubjectData({...newSubjectData, teacherId: e.target.value})}
                     className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none"
                  >
                     <option value="">Select...</option>
                     {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>)}
                  </select>
               </div>
            </div>
         </Modal>
      )}

    </div>
  );
};