import React, { useState, useRef } from 'react';
import { Card } from './ui/Card';
import { Search, Filter, Eye, Download, Upload, FileSpreadsheet, Trash2, CheckSquare, XSquare, DollarSign, X, Layers, ArrowRight, UserX, UserCheck, CreditCard } from 'lucide-react';
import { INITIAL_STUDENTS } from '../data';
import { UserRole } from '../types';
import { StudentIdCard } from './StudentIdCard';

interface StudentListProps {
  onNavigate: (view: string, id?: string) => void;
  userRole?: UserRole;
}

interface Student {
  id: string;
  name: string;
  class: string;
  parent: string;
  status: string;
  fee: string;
  category?: string; // Added category
}

export const StudentList: React.FC<StudentListProps> = ({ onNavigate, userRole }) => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS.map(s => ({...s, category: 'General'}))); // Default category
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<'list' | 'categories' | 'promote' | 'disabled'>('list');
  const [viewingIdCard, setViewingIdCard] = useState<string | null>(null);
  
  // Category State
  const [categories, setCategories] = useState(['General', 'Scholarship', 'Sports Quota', 'Staff Child']);
  const [newCategory, setNewCategory] = useState('');

  // Promote State
  const [promoteFrom, setPromoteFrom] = useState('');
  const [promoteTo, setPromoteTo] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has write access (Admin/Super Admin)
  const canEdit = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN;

  // --- Selection Logic ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>, list: Student[]) => {
    if (e.target.checked) {
      setSelectedIds(new Set(list.map(s => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const applyBulkAction = (action: 'status' | 'fee' | 'delete', value?: string) => {
    if (selectedIds.size === 0) return;
    
    if (action === 'delete') {
       if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} students?`)) return;
       setStudents(prev => prev.filter(s => !selectedIds.has(s.id)));
    } else {
       setStudents(prev => prev.map(s => {
         if (selectedIds.has(s.id)) {
           if (action === 'status' && value) return { ...s, status: value };
           if (action === 'fee' && value) return { ...s, fee: value };
         }
         return s;
       }));
    }
    setSelectedIds(new Set());
  };

  // --- Category Logic ---
  const handleAddCategory = () => {
      if (newCategory && !categories.includes(newCategory)) {
          setCategories([...categories, newCategory]);
          setNewCategory('');
      }
  };

  const handleDeleteCategory = (cat: string) => {
      if (window.confirm(`Delete category '${cat}'?`)) {
          setCategories(categories.filter(c => c !== cat));
      }
  };

  // --- Promote Logic ---
  const handlePromote = () => {
      if (!promoteFrom || !promoteTo) {
          alert("Please select both source and target classes.");
          return;
      }
      if (selectedIds.size === 0) {
          alert("Please select students to promote.");
          return;
      }

      if (window.confirm(`Promote ${selectedIds.size} students from ${promoteFrom} to ${promoteTo}?`)) {
          setStudents(prev => prev.map(s => {
              if (selectedIds.has(s.id)) {
                  return { ...s, class: promoteTo };
              }
              return s;
          }));
          setSelectedIds(new Set());
          alert("Students promoted successfully.");
      }
  };

  // --- Bulk Export ---
  const handleExport = () => {
    const headers = ['ID,Name,Class,Parent,Status,FeeStatus,Category'];
    const rows = students.map(s => 
      `${s.id},${s.name},${s.class},${s.parent},${s.status},${s.fee},${s.category || ''}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Bulk Import ---
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n');
      const newStudents: Student[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [id, name, className, parent, status, fee, category] = line.split(',');
        if (name) {
             newStudents.push({
                id: id || `STD-${Date.now() + i}`, 
                name: name.trim(),
                class: className?.trim() || 'N/A',
                parent: parent?.trim() || 'N/A',
                status: status?.trim() || 'Active',
                fee: fee?.trim() || 'Pending',
                category: category?.trim() || 'General'
             });
        }
      }

      if (newStudents.length > 0) {
        setStudents(prev => [...prev, ...newStudents]);
        alert(`Successfully imported ${newStudents.length} students.`);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };
  
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this student record?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleIdCardClick = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setViewingIdCard(id);
  };

  // --- Render Helpers ---
  const renderStudentTable = (data: Student[], showActions = true) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
            <tr>
            <th className="p-4 w-10">
                {canEdit && (
                    <input 
                        type="checkbox" 
                        onChange={(e) => handleSelectAll(e, data)} 
                        checked={selectedIds.size === data.length && data.length > 0}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                )}
            </th>
            <th className="p-4">ID</th>
            <th className="p-4">Student Name</th>
            <th className="p-4">Class</th>
            <th className="p-4">Category</th>
            <th className="p-4">Status</th>
            {showActions && <th className="p-4 text-right">Action</th>}
            </tr>
        </thead>
        <tbody className="text-sm divide-y divide-slate-100">
            {data.map((student) => (
            <tr 
                key={student.id} 
                className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${selectedIds.has(student.id) ? 'bg-indigo-50/30' : ''}`} 
                onClick={() => onNavigate('student-profile', student.id)}
            >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    {canEdit && (
                        <input 
                            type="checkbox" 
                            checked={selectedIds.has(student.id)}
                            onChange={() => handleSelectOne(student.id)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                    )}
                </td>
                <td className="p-4 font-medium text-indigo-600">{student.id}</td>
                <td className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                    {student.name[0]}
                </div>
                <span className="font-medium text-slate-800">{student.name}</span>
                </td>
                <td className="p-4 text-slate-600">{student.class}</td>
                <td className="p-4 text-slate-500 text-xs"><span className="bg-slate-100 px-2 py-1 rounded">{student.category}</span></td>
                <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {student.status}
                </span>
                </td>
                {showActions && (
                    <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={(e) => handleIdCardClick(e, student.id)}
                            className="p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-full text-slate-400 transition-colors"
                            title="Generate ID Card"
                        >
                            <CreditCard size={18} />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-colors">
                            <Eye size={18} />
                        </button>
                        {canEdit && (
                        <button 
                            onClick={(e) => handleDelete(student.id, e)}
                            className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full text-slate-400 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                        )}
                    </div>
                    </td>
                )}
            </tr>
            ))}
            {data.length === 0 && (
                <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">No students found.</td>
                </tr>
            )}
        </tbody>
        </table>
    </div>
  );

  const studentForIdCard = viewingIdCard ? students.find(s => s.id === viewingIdCard) : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Info</h1>
          <p className="text-slate-500">Manage students, admission, categories and promotions.</p>
        </div>
        
        {/* Actions only for Admins */}
        {canEdit && currentView === 'list' && (
          <div className="flex flex-wrap gap-2">
             <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-indigo-200 text-sm font-medium transition-all shadow-sm"><Download size={16} /> Export</button>
             <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
             <button onClick={triggerImport} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-indigo-200 text-sm font-medium transition-all shadow-sm"><Upload size={16} /> Import</button>
             <button onClick={() => onNavigate('admission')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-lg shadow-indigo-200 flex items-center gap-2"><FileSpreadsheet size={16} /> + Admission</button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-6">
          {[
              { id: 'list', label: 'All Students' },
              { id: 'promote', label: 'Promote Students' },
              { id: 'categories', label: 'Student Category' },
              { id: 'disabled', label: 'Disabled Students' }
          ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setCurrentView(tab.id as any); setSelectedIds(new Set()); }}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${currentView === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                  {tab.label}
              </button>
          ))}
      </div>

      <Card className="p-0 overflow-hidden">
        {/* --- LIST VIEW --- */}
        {currentView === 'list' && (
            <>
                {selectedIds.size > 0 && canEdit ? (
                <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md">{selectedIds.size} Selected</span>
                        <button onClick={() => setSelectedIds(new Set())} className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1"><X size={14} /> Clear</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => applyBulkAction('status', 'Active')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-sm hover:border-emerald-300 hover:text-emerald-700 shadow-sm"><CheckSquare size={14} /> Set Active</button>
                        <button onClick={() => applyBulkAction('status', 'Inactive')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-sm hover:border-slate-400 hover:text-slate-800 shadow-sm"><XSquare size={14} /> Disable</button>
                        <div className="w-px h-6 bg-slate-300 mx-1 hidden md:block"></div>
                        <button onClick={() => applyBulkAction('fee', 'Paid')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-sm hover:border-emerald-300 hover:text-emerald-700 shadow-sm"><DollarSign size={14} /> Mark Fees Paid</button>
                        <button onClick={() => applyBulkAction('delete')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-md text-sm hover:bg-red-50 shadow-sm"><Trash2 size={14} /> Delete</button>
                    </div>
                </div>
                ) : (
                <div className="p-5 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search by name, roll no, or parent..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none" />
                    </div>
                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2"><Filter size={18} /> Filter</button>
                </div>
                )}
                {renderStudentTable(students.filter(s => s.status !== 'Inactive'))}
            </>
        )}

        {/* --- DISABLED STUDENTS VIEW --- */}
        {currentView === 'disabled' && (
            <>
                <div className="p-5 border-b border-slate-100 bg-red-50/30">
                    <h3 className="text-red-700 font-bold flex items-center gap-2"><UserX size={20}/> Disabled / Inactive Students</h3>
                    <p className="text-sm text-slate-500">Students listed here are inactive and have limited access.</p>
                </div>
                {renderStudentTable(students.filter(s => s.status === 'Inactive'))}
            </>
        )}

        {/* --- CATEGORIES VIEW --- */}
        {currentView === 'categories' && (
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                        <h3 className="font-bold text-slate-800">Add New Category</h3>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="e.g. International Student" 
                                className="flex-1 p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                            <button onClick={handleAddCategory} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Add</button>
                        </div>
                        <p className="text-xs text-slate-500">Categories help in grouping students for fee structure and reporting.</p>
                    </div>
                    <div className="flex-1 border-l border-slate-100 pl-8">
                        <h3 className="font-bold text-slate-800 mb-4">Existing Categories</h3>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <div key={cat} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="font-medium text-slate-700">{cat}</span>
                                    <button onClick={() => handleDeleteCategory(cat)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- PROMOTE STUDENTS VIEW --- */}
        {currentView === 'promote' && (
            <div className="p-6">
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6">
                    <h3 className="text-indigo-800 font-bold flex items-center gap-2 mb-2"><Layers size={20}/> Bulk Student Promotion</h3>
                    <p className="text-sm text-indigo-600">Select students from a source class and promote them to a higher class for the new academic session.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Promote From Class</label>
                        <select 
                            value={promoteFrom} 
                            onChange={(e) => setPromoteFrom(e.target.value)}
                            className="w-full p-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">Select Class...</option>
                            {[...new Set(students.map(s => s.class))].sort().map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="hidden md:flex pb-3 text-slate-300"><ArrowRight size={24}/></div>
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Class (Promotion)</label>
                        <input 
                            type="text" 
                            value={promoteTo}
                            onChange={(e) => setPromoteTo(e.target.value)}
                            placeholder="e.g. 11-A"
                            className="w-full p-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                    <button 
                        onClick={handlePromote}
                        disabled={selectedIds.size === 0 || !promoteTo}
                        className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-200"
                    >
                        Promote Students
                    </button>
                </div>

                {promoteFrom && (
                    <div className="border-t border-slate-200 pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-slate-700">Students in {promoteFrom}</h4>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{students.filter(s => s.class === promoteFrom).length} Students</span>
                        </div>
                        {renderStudentTable(students.filter(s => s.class === promoteFrom), false)}
                    </div>
                )}
            </div>
        )}
      </Card>

      {/* ID CARD MODAL */}
      {viewingIdCard && studentForIdCard && (
          <StudentIdCard 
            student={studentForIdCard} 
            onClose={() => setViewingIdCard(null)} 
          />
      )}
    </div>
  );
};