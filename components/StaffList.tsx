import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { Search, Filter, MoreHorizontal, Plus, Briefcase, UserCheck, Trash2, Download, Upload, Eye, Edit, CheckSquare, XSquare, X } from 'lucide-react';
import { INITIAL_STAFF } from '../data';
import { UserRole } from '../types';

interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

interface StaffListProps {
  userRole?: UserRole;
}

export const StaffList: React.FC<StaffListProps> = ({ userRole }) => {
  const [staffList, setStaffList] = useState<Staff[]>(INITIAL_STAFF as Staff[]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Only Admins can manage Staff
  const canEdit = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Form State
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    department: '',
    phone: '',
    status: 'Active' as Staff['status']
  });

  // Derived Stats
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter(s => s.status === 'Active').length;
  const onLeaveStaff = staffList.filter(s => s.status === 'On Leave').length;

  const filteredStaff = staffList.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Selection Logic ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredStaff.map(s => s.id)));
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
      if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} staff members?`)) return;
      setStaffList(prev => prev.filter(s => !selectedIds.has(s.id)));
    } else {
      setStaffList(prev => prev.map(s => {
        if (selectedIds.has(s.id)) {
          if (action === 'status' && value) return { ...s, status: value as any };
        }
        return s;
      }));
    }
    setSelectedIds(new Set());
  };

  const handleOpenModal = (staff?: Staff) => {
    if (staff) {
      setEditingId(staff.id);
      setStaffForm({
        name: staff.name,
        role: staff.role,
        department: staff.department,
        phone: staff.phone,
        status: staff.status
      });
    } else {
      setEditingId(null);
      setStaffForm({ name: '', role: '', department: '', phone: '', status: 'Active' });
    }
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveStaff = () => {
    if (!staffForm.name || !staffForm.role) return;

    if (editingId) {
      // Update
      setStaffList(prev => prev.map(s => s.id === editingId ? {
        ...s,
        name: staffForm.name,
        role: staffForm.role,
        department: staffForm.department,
        phone: staffForm.phone,
        status: staffForm.status
      } : s));
    } else {
      // Create
      const staff: Staff = {
        id: `STF-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: staffForm.name,
        role: staffForm.role,
        department: staffForm.department,
        phone: staffForm.phone,
        status: staffForm.status
      };
      setStaffList([...staffList, staff]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      setStaffList(staffList.filter(s => s.id !== id));
    }
  };

  const handleMenuAction = (e: React.MouseEvent, action: string, staff: Staff) => {
    e.stopPropagation();
    setActiveMenuId(null);

    if (action === 'delete') {
      handleDelete(staff.id);
    } else if (action === 'edit') {
      handleOpenModal(staff);
    } else if (action === 'view') {
      alert(`Viewing details for ${staff.name}`);
    }
  };

  // --- Bulk Export ---
  const handleExport = () => {
    const headers = ['ID,Name,Role,Department,Phone,Status'];
    const rows = staffList.map(s =>
      `${s.id},${s.name},${s.role},${s.department},${s.phone},${s.status}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "staff_export.csv");
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
      const newStaffList: Staff[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [id, name, role, department, phone, status] = line.split(',');
        if (name) {
          newStaffList.push({
            id: id || `STF-${Date.now() + i}`,
            name: name.trim(),
            role: role?.trim() || 'Staff',
            department: department?.trim() || 'General',
            phone: phone?.trim() || 'N/A',
            status: (status?.trim() as any) || 'Active'
          });
        }
      }

      if (newStaffList.length > 0) {
        setStaffList(prev => [...prev, ...newStaffList]);
        alert(`Successfully imported ${newStaffList.length} staff members.`);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff & HR Directory</h1>
          <p className="text-slate-500">Manage non-teaching staff, payroll, and roles.</p>
        </div>
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
              <Plus size={18} /> Add Staff
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Staff</p>
              <h3 className="text-3xl font-bold">{totalStaff}</h3>
            </div>
          </div>
        </Card>
        <Card className="bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Status</p>
              <h3 className="text-3xl font-bold text-slate-800">{activeStaff}</h3>
            </div>
          </div>
        </Card>
        <Card className="bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">On Leave</p>
              <h3 className="text-3xl font-bold text-slate-800">{onLeaveStaff}</h3>
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
                <Briefcase size={14} /> Set On Leave
              </button>
              <button onClick={() => applyBulkAction('status', 'Inactive')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-sm hover:border-slate-400 hover:text-slate-800 shadow-sm">
                <XSquare size={14} /> Set Inactive
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
                placeholder="Search staff by name, role, or department..."
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
                      checked={selectedIds.size === filteredStaff.length && filteredStaff.length > 0}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  )}
                </th>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filteredStaff.map((staff) => (
                <tr
                  key={staff.id}
                  className={`hover:bg-slate-50/50 transition-colors group relative ${selectedIds.has(staff.id) ? 'bg-indigo-50/30' : ''}`}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    {canEdit && (
                      <input
                        type="checkbox"
                        checked={selectedIds.has(staff.id)}
                        onChange={() => handleSelectOne(staff.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    )}
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 block">{staff.name}</span>
                      <span className="text-xs text-slate-500">{staff.id}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{staff.role}</td>
                  <td className="p-4 text-slate-500">{staff.department}</td>
                  <td className="p-4 text-slate-600">{staff.phone}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${staff.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 relative">
                      {/* More Menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === staff.id ? null : staff.id); }}
                          className={`p-2 rounded-lg text-slate-500 transition-colors ${activeMenuId === staff.id ? 'bg-slate-100 text-slate-800' : 'hover:bg-slate-100'}`}
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === staff.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                            <div className="py-1">
                              <button onClick={(e) => handleMenuAction(e, 'view', staff)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                <Eye size={16} className="text-slate-400" /> View Details
                              </button>
                              {canEdit && (
                                <>
                                  <button onClick={(e) => handleMenuAction(e, 'edit', staff)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <Edit size={16} className="text-slate-400" /> Edit Staff
                                  </button>
                                  <div className="h-px bg-slate-100 my-1"></div>
                                  <button onClick={(e) => handleMenuAction(e, 'delete', staff)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <Trash2 size={16} /> Delete Staff
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {canEdit && (
                        <button
                          onClick={() => handleDelete(staff.id)}
                          className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        title={editingId ? "Edit Staff Details" : "Add New Staff Member"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleSaveStaff} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200">
              {editingId ? "Save Changes" : "Add Staff"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={staffForm.name}
              onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Role</label>
              <input
                type="text"
                placeholder="e.g. Accountant"
                value={staffForm.role}
                onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input
                type="text"
                placeholder="e.g. Finance"
                value={staffForm.department}
                onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="+1 555..."
              value={staffForm.phone}
              onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employment Status</label>
            <select
              value={staffForm.status}
              onChange={(e) => setStaffForm({ ...staffForm, status: e.target.value as any })}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};