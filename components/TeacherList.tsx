import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { Search, Filter, Mail, Phone, MoreHorizontal, Plus, Trash2, GraduationCap, Download, Upload, Eye, Edit, CheckSquare, XSquare, X } from 'lucide-react';
import { INITIAL_TEACHERS } from '../data';
import { UserRole } from '../types';

interface TeacherListProps {
  onNavigate: (view: string, id?: string) => void;
  userRole?: UserRole;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  classes: string[];
  email: string;
  status: 'Active' | 'On Leave';
  phone?: string;
}

export const TeacherList: React.FC<TeacherListProps> = ({ onNavigate, userRole }) => {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS as Teacher[]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has write access (Admin/Super Admin)
  const canEdit = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Form State
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    subject: '',
    email: '',
    phone: '',
    classes: ''
  });

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Selection Logic ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredTeachers.map(t => t.id)));
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

  const applyBulkAction = (action: 'status' | 'delete', value?: string) => {
    if (selectedIds.size === 0) return;

    if (action === 'delete') {
      if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} teachers?`)) return;
      setTeachers(prev => prev.filter(t => !selectedIds.has(t.id)));
    } else {
      setTeachers(prev => prev.map(t => {
        if (selectedIds.has(t.id)) {
          if (action === 'status' && value) return { ...t, status: value as 'Active' | 'On Leave' };
        }
        return t;
      }));
    }
    setSelectedIds(new Set());
  };

  const handleOpenModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingId(teacher.id);
      setTeacherForm({
        name: teacher.name,
        subject: teacher.subject,
        email: teacher.email,
        phone: teacher.phone || '',
        classes: teacher.classes.join(', ')
      });
    } else {
      setEditingId(null);
      setTeacherForm({ name: '', subject: '', email: '', phone: '', classes: '' });
    }
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveTeacher = () => {
    if (!teacherForm.name || !teacherForm.subject) return;

    if (editingId) {
      // Edit existing
      setTeachers(prev => prev.map(t => t.id === editingId ? {
        ...t,
        name: teacherForm.name,
        subject: teacherForm.subject,
        email: teacherForm.email,
        phone: teacherForm.phone,
        classes: teacherForm.classes ? teacherForm.classes.split(',').map(c => c.trim()) : []
      } : t));
    } else {
      // Add new
      const newTeacher: Teacher = {
        id: `TCH-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: teacherForm.name,
        subject: teacherForm.subject,
        email: teacherForm.email || `${teacherForm.name.toLowerCase().replace(' ', '.')}@school.com`,
        phone: teacherForm.phone,
        classes: teacherForm.classes ? teacherForm.classes.split(',').map(c => c.trim()) : [],
        status: 'Active'
      };
      setTeachers([...teachers, newTeacher]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this teacher?')) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const handleRowClick = (id: string) => {
    onNavigate('teacher-profile', id);
  };

  const handleMenuAction = (e: React.MouseEvent, action: string, teacher: Teacher) => {
    e.stopPropagation();
    setActiveMenuId(null);

    if (action === 'view') {
      onNavigate('teacher-profile', teacher.id);
    } else if (action === 'delete') {
      handleDelete(teacher.id);
    } else if (action === 'edit') {
      handleOpenModal(teacher);
    }
  };

  // --- Bulk Export ---
  const handleExport = () => {
    const headers = ['ID,Name,Subject,Classes,Email,Status'];
    const rows = teachers.map(t =>
      `${t.id},${t.name},${t.subject},"${t.classes.join(';')}",${t.email},${t.status}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "teachers_export.csv");
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
      const newTeachers: Teacher[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [id, name, subject, classesStr, email, status] = line.split(',');

        if (name) {
          const cleanedClasses = classesStr ? classesStr.replace(/"/g, '').split(';') : [];
          newTeachers.push({
            id: id || `TCH-${Date.now() + i}`,
            name: name.trim(),
            subject: subject?.trim() || 'General',
            classes: cleanedClasses,
            email: email?.trim() || 'N/A',
            status: (status?.trim() as any) || 'Active'
          });
        }
      }

      if (newTeachers.length > 0) {
        setTeachers(prev => [...prev, ...newTeachers]);
        alert(`Successfully imported ${newTeachers.length} teachers.`);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teachers Directory</h1>
          <p className="text-slate-500">Manage teaching faculty and assignments.</p>
        </div>

        {/* Actions for Admins Only */}
        {canEdit && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm"
            >
              <Download size={18} /> Export
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm"
            >
              <Upload size={18} /> Import
            </button>

            <button
              onClick={() => handleOpenModal()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
            >
              <Plus size={18} /> Add Teacher
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-indigo-600 text-white border-none">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Faculty</p>
              <h3 className="text-3xl font-bold">{teachers.length}</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        {/* Toolbar / Bulk Actions */}
        {selectedIds.size > 0 && canEdit ? (
          <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md">{selectedIds.size} Selected</span>
              <button onClick={() => setSelectedIds(new Set())} className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1">
                <X size={14} /> Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => applyBulkAction('status', 'Active')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-sm hover:border-emerald-300 hover:text-emerald-700 shadow-sm">
                <CheckSquare size={14} /> Set Active
              </button>
              <button onClick={() => applyBulkAction('status', 'On Leave')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-sm hover:border-amber-300 hover:text-amber-700 shadow-sm">
                <XSquare size={14} /> Set On Leave
              </button>
              <button onClick={() => applyBulkAction('delete')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-md text-sm hover:bg-red-50 shadow-sm">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 border-b border-slate-100 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, subject, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2">
              <Filter size={18} /> Filter
            </button>
          </div>
        )}

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="p-4 w-10">
                  {canEdit && (
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedIds.size === filteredTeachers.length && filteredTeachers.length > 0}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  )}
                </th>
                <th className="p-4">Teacher Name</th>
                <th className="p-4">ID</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Assigned Classes</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filteredTeachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  onClick={() => handleRowClick(teacher.id)}
                  className={`hover:bg-slate-50/50 transition-colors group cursor-pointer relative ${selectedIds.has(teacher.id) ? 'bg-indigo-50/30' : ''}`}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    {canEdit && (
                      <input
                        type="checkbox"
                        checked={selectedIds.has(teacher.id)}
                        onChange={() => handleSelectOne(teacher.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    )}
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                      {teacher.name.split(' ')[1]?.[0] || teacher.name[0]}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 block">{teacher.name}</span>
                      <span className="text-xs text-slate-500">{teacher.email}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-500">{teacher.id}</td>
                  <td className="p-4 font-medium text-slate-700">{teacher.subject}</td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {teacher.classes.map(c => (
                        <span key={c} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"><Mail size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"><Phone size={16} /></button>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${teacher.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 relative">
                      {/* More Menu Trigger */}
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === teacher.id ? null : teacher.id); }}
                          className={`p-2 rounded-lg text-slate-500 transition-colors ${activeMenuId === teacher.id ? 'bg-slate-100 text-slate-800' : 'hover:bg-slate-100'}`}
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === teacher.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                            <div className="py-1">
                              <button onClick={(e) => handleMenuAction(e, 'view', teacher)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                <Eye size={16} className="text-slate-400" /> View Profile
                              </button>
                              {canEdit && (
                                <>
                                  <button onClick={(e) => handleMenuAction(e, 'edit', teacher)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <Edit size={16} className="text-slate-400" /> Edit Details
                                  </button>
                                  <div className="h-px bg-slate-100 my-1"></div>
                                  <button onClick={(e) => handleMenuAction(e, 'delete', teacher)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <Trash2 size={16} /> Delete Teacher
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {canEdit && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(teacher.id); }}
                          className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTeachers.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No teachers found. Try adjusting your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        title={editingId ? "Edit Teacher Details" : "Add New Teacher"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleSaveTeacher} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200">
              {editingId ? "Save Changes" : "Add Teacher"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Mr. John Doe"
              value={teacherForm.name}
              onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject Specialization</label>
            <input
              type="text"
              placeholder="e.g. Mathematics"
              value={teacherForm.subject}
              onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="email@school.com"
                value={teacherForm.email}
                onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 555..."
                value={teacherForm.phone}
                onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Classes (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. 10-A, 10-B"
              value={teacherForm.classes}
              onChange={(e) => setTeacherForm({ ...teacherForm, classes: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};