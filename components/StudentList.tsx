import React, { useState, useRef, useMemo } from 'react';
import { Card } from './ui/Card';
import { Search, Filter, Eye, Download, Upload, FileSpreadsheet, Trash2, CheckSquare, XSquare, DollarSign, X, Layers, ArrowRight, UserX, UserCheck, CreditCard } from 'lucide-react';
import { INITIAL_STUDENTS, INITIAL_CLASSES } from '../data';
import { UserRole } from '../types';
import { StudentIdCard } from './StudentIdCard';
import { getStudents, deleteStudent, updateStudent } from '../src/api';

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
    category?: string;
    attendance?: number;
    email?: string;
}

export const StudentList: React.FC<StudentListProps> = ({ onNavigate, userRole }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination & Filter States
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [search, setSearch] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedFee, setSelectedFee] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [currentView, setCurrentView] = useState<'list' | 'categories' | 'promote' | 'disabled'>('list');

    // Debounce search input
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchTerm);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Active classes based on selected grade
    const classesForGrade = useMemo(() => {
        if (!selectedGrade) return INITIAL_CLASSES.map(c => c.name).sort();
        return INITIAL_CLASSES
            .filter(c => c.name.startsWith(selectedGrade))
            .map(c => c.name)
            .sort();
    }, [selectedGrade]);

    // Reload students on any param change
    React.useEffect(() => {
        loadStudents();
    }, [page, search, selectedClass, selectedGrade, selectedFee, currentView]);

    const loadStudents = async () => {
        try {
            setIsLoading(true);
            const statusParam = currentView === 'disabled' ? 'Inactive' : (currentView === 'list' ? 'Active' : undefined);
            
            const data = await getStudents({
                page,
                limit,
                search,
                class: selectedClass,
                grade: selectedGrade,
                status: statusParam,
                fee: selectedFee
            });

            if (data && data.students) {
                setStudents(data.students.map((s: any) => ({ ...s, category: s.category || 'General' })));
                setTotalPages(data.pagination.totalPages || 1);
                setTotalCount(data.pagination.total || 0);
            } else {
                setStudents([]);
            }
        } catch (err: any) {
            console.error("Failed to load students:", err);
            setError(err.message);
            // Fallback to mock data if API fails
            setStudents(INITIAL_STUDENTS.map(s => ({ ...s, category: 'General' })) as any);
        } finally {
            setIsLoading(false);
        }
    };

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
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

    const applyBulkAction = async (action: 'status' | 'fee' | 'delete', value?: string) => {
        if (selectedIds.size === 0) return;

        try {
            if (action === 'delete') {
                if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} students?`)) return;
                for (const id of selectedIds) {
                    await deleteStudent(id);
                }
                setStudents(prev => prev.filter(s => !selectedIds.has(s.id)));
            } else {
                for (const id of selectedIds) {
                    const student = students.find(s => s.id === id);
                    if (student) {
                        const updated = { ...student };
                        if (action === 'status' && value) updated.status = value;
                        if (action === 'fee' && value) updated.fee = value;
                        await updateStudent(id, updated);
                    }
                }
                setStudents(prev => prev.map(s => {
                    if (selectedIds.has(s.id)) {
                        if (action === 'status' && value) return { ...s, status: value };
                        if (action === 'fee' && value) return { ...s, fee: value };
                    }
                    return s;
                }));
            }
            setSelectedIds(new Set());
        } catch (err: any) {
            alert(`Bulk action failed: ${err.message}`);
        }
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
    const handlePromote = async () => {
        if (!promoteFrom || !promoteTo) {
            alert("Please select both source and target classes.");
            return;
        }
        if (selectedIds.size === 0) {
            alert("Please select students to promote.");
            return;
        }

        if (window.confirm(`Promote ${selectedIds.size} students from ${promoteFrom} to ${promoteTo}?`)) {
            try {
                for (const id of selectedIds) {
                    const student = students.find(s => s.id === id);
                    if (student) {
                        await updateStudent(id, { ...student, class: promoteTo });
                    }
                }
                setStudents(prev => prev.map(s => {
                    if (selectedIds.has(s.id)) {
                        return { ...s, class: promoteTo };
                    }
                    return s;
                }));
                setSelectedIds(new Set());
                alert("Students promoted successfully.");
            } catch (err: any) {
                alert(`Promotion failed: ${err.message}`);
            }
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

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this student record?')) {
            try {
                await deleteStudent(id);
                setStudents(prev => prev.filter(s => s.id !== id));
            } catch (err: any) {
                alert(`Delete failed: ${err.message}`);
            }
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
                <thead className="bg-slate-50/80 text-[10px] uppercase text-slate-400 font-bold tracking-wider">
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
                <tbody className="text-sm divide-y divide-slate-50">
                    {data.map((student) => (
                        <tr
                            key={student.id}
                            className={`table-row-accent hover:bg-slate-50/70 transition-all group cursor-pointer ${selectedIds.has(student.id) ? 'bg-indigo-50/30' : ''}`}
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
                            <td className="p-4 font-semibold text-indigo-600 text-xs">{student.id}</td>
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center font-bold text-indigo-600 text-xs border border-indigo-50">
                                        {student.name[0]}
                                    </div>
                                    <span className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{student.name}</span>
                                </div>
                            </td>
                            <td className="p-4 text-slate-600 font-medium text-xs">{student.class}</td>
                            <td className="p-4"><span className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-[11px] text-slate-500 font-medium">{student.category}</span></td>
                            <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${student.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                                    {student.status}
                                </span>
                            </td>
                            {showActions && (
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            onClick={(e) => handleIdCardClick(e, student.id)}
                                            className="p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl text-slate-400 transition-colors opacity-0 group-hover:opacity-100"
                                            data-tooltip="ID Card"
                                        >
                                            <CreditCard size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100" data-tooltip="View">
                                            <Eye size={16} />
                                        </button>
                                        {canEdit && (
                                            <button
                                                onClick={(e) => handleDelete(student.id, e)}
                                                className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl text-slate-400 transition-colors opacity-0 group-hover:opacity-100"
                                                data-tooltip="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={7} className="p-12 text-center text-slate-400">
                                <div className="flex flex-col items-center gap-2">
                                    <UserX size={32} className="text-slate-300" />
                                    <span>No students found</span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        let startPage = Math.max(1, page - 2);
        let endPage = Math.min(totalPages, page + 2);
        if (endPage - startPage < 4) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, 5);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, totalPages - 4);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
                <span className="text-xs text-slate-500 font-medium order-2 sm:order-1">
                    Showing <strong className="text-slate-700">{(page - 1) * limit + 1}</strong> to{" "}
                    <strong className="text-slate-700">
                        {Math.min(page * limit, totalCount)}
                    </strong>{" "}
                    of <strong className="text-slate-700">{totalCount}</strong> learners
                </span>
                
                <div className="flex gap-1.5 order-1 sm:order-2">
                    <button
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold shadow-sm transition-all"
                    >
                        Prev
                    </button>
                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => setPage(1)}
                                className={`px-3 py-1.5 border rounded-xl text-xs font-semibold shadow-sm transition-all ${
                                    page === 1
                                        ? "bg-indigo-600 border-indigo-600 text-white"
                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="text-slate-400 px-1 self-center text-xs">...</span>}
                        </>
                    )}
                    {pages.map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-1.5 border rounded-xl text-xs font-semibold shadow-sm transition-all ${
                                page === p
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-100"
                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="text-slate-400 px-1 self-center text-xs">...</span>}
                            <button
                                onClick={() => setPage(totalPages)}
                                className={`px-3 py-1.5 border rounded-xl text-xs font-semibold shadow-sm transition-all ${
                                    page === totalPages
                                        ? "bg-indigo-600 border-indigo-600 text-white"
                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold shadow-sm transition-all"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    const studentForIdCard = viewingIdCard ? students.find(s => s.id === viewingIdCard) : null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Info</h1>
                    <p className="text-slate-400 mt-1">Manage students, admission, categories and promotions.</p>
                </div>

                {/* Actions only for Admins */}
                {canEdit && currentView === 'list' && (
                    <div className="flex flex-wrap gap-2">
                        <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:border-slate-300 text-sm font-medium transition-all btn-lift"><Download size={15} /> Export</button>
                        <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
                        <button onClick={triggerImport} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:border-slate-300 text-sm font-medium transition-all btn-lift"><Upload size={15} /> Import</button>
                        <button onClick={() => onNavigate('admission')} className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-violet-700 text-sm font-medium shadow-lg shadow-indigo-200/50 flex items-center gap-2 btn-lift"><FileSpreadsheet size={15} /> + Admission</button>
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
                                    <button onClick={() => applyBulkAction('fee', 'Paid')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-sm hover:border-emerald-300 hover:text-emerald-700 shadow-sm"><span style={{ fontWeight: 800 }}>R</span> Mark Fees Paid</button>
                                    <button onClick={() => applyBulkAction('delete')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-md text-sm hover:bg-red-50 shadow-sm"><Trash2 size={14} /> Delete</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="p-4 border-b border-slate-100 flex gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search by name, roll no, parent or email..."
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm input-premium outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`px-4 py-2.5 border rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                                    >
                                        <Filter size={16} /> Filter
                                    </button>
                                </div>
                                {showFilters && (
                                    <div className="p-4 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Grade</label>
                                            <select
                                                value={selectedGrade}
                                                onChange={(e) => { setSelectedGrade(e.target.value); setSelectedClass(''); setPage(1); }}
                                                className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-slate-700 font-semibold"
                                            >
                                                <option value="">All Grades</option>
                                                <option value="R">Grade R</option>
                                                <option value="1">Grade 1</option>
                                                <option value="2">Grade 2</option>
                                                <option value="3">Grade 3</option>
                                                <option value="4">Grade 4</option>
                                                <option value="5">Grade 5</option>
                                                <option value="6">Grade 6</option>
                                                <option value="7">Grade 7</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Class</label>
                                            <select
                                                value={selectedClass}
                                                onChange={(e) => { setSelectedClass(e.target.value); setPage(1); }}
                                                className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-slate-700 font-semibold"
                                            >
                                                <option value="">All Classes</option>
                                                {classesForGrade.map(c => <option key={c} value={c}>Class {c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fee Status</label>
                                            <select
                                                value={selectedFee}
                                                onChange={(e) => { setSelectedFee(e.target.value); setPage(1); }}
                                                className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-slate-700 font-semibold"
                                            >
                                                <option value="">All Fee Statuses</option>
                                                <option value="Paid">Paid</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Overdue">Overdue</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {isLoading ? (
                            <div className="p-16 flex flex-col items-center justify-center gap-4 text-slate-400">
                                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                <span className="text-sm font-medium">Loading learners...</span>
                            </div>
                        ) : (
                            <>
                                {renderStudentTable(students)}
                                {renderPagination()}
                            </>
                        )}
                    </>
                )}

                {/* --- DISABLED STUDENTS VIEW --- */}
                {currentView === 'disabled' && (
                    <>
                        <div className="p-5 border-b border-slate-100 bg-red-50/30">
                            <h3 className="text-red-700 font-bold flex items-center gap-2"><UserX size={20} /> Disabled / Inactive Students</h3>
                            <p className="text-sm text-slate-500">Students listed here are inactive and have limited access.</p>
                        </div>
                        {isLoading ? (
                            <div className="p-16 flex flex-col items-center justify-center gap-4 text-slate-400">
                                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                <span className="text-sm font-medium">Loading inactive learners...</span>
                            </div>
                        ) : (
                            <>
                                {renderStudentTable(students)}
                                {renderPagination()}
                            </>
                        )}
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
                                            <button onClick={() => handleDeleteCategory(cat)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
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
                            <h3 className="text-indigo-800 font-bold flex items-center gap-2 mb-2"><Layers size={20} /> Bulk Student Promotion</h3>
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
                            <div className="hidden md:flex pb-3 text-slate-300"><ArrowRight size={24} /></div>
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