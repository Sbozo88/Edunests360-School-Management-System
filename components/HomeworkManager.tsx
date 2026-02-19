import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { 
  BookOpen, Calendar, CheckCircle, Clock, FileText, 
  Plus, Search, Filter, Trash2, Paperclip, User, Edit, 
  ChevronRight, Save, AlertCircle 
} from 'lucide-react';
import { UserRole } from '../types';
import { INITIAL_STUDENTS } from '../data';

interface HomeworkManagerProps {
  userRole?: UserRole;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  teacher: string;
  assignDate: string;
  dueDate: string;
  description: string;
  status: 'Active' | 'Closed';
  submissions: number;
  totalStudents: number;
}

interface Submission {
  studentId: string;
  studentName: string;
  status: 'Pending' | 'Submitted' | 'Graded' | 'Late';
  submissionDate?: string;
  score?: string;
  feedback?: string;
}

const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: '1', title: 'Algebra Problem Set 4', subject: 'Mathematics', class: '10-A', teacher: 'Mr. John Doe', assignDate: '2023-10-20', dueDate: '2023-10-25', description: 'Complete exercises 14-20 on page 102. Show all working.', status: 'Active', submissions: 15, totalStudents: 30 },
  { id: '2', title: 'Shakespeare Essay', subject: 'English', class: '10-A', teacher: 'Mrs. Sarah Smith', assignDate: '2023-10-18', dueDate: '2023-10-24', description: 'Write a 500-word essay on the themes of ambition in Macbeth.', status: 'Active', submissions: 28, totalStudents: 30 },
  { id: '3', title: 'Chemical Reactions Report', subject: 'Science', class: '9-B', teacher: 'Dr. Emily White', assignDate: '2023-10-15', dueDate: '2023-10-20', description: 'Submit your lab report for the vinegar and baking soda experiment.', status: 'Closed', submissions: 29, totalStudents: 29 },
];

export const HomeworkManager: React.FC<HomeworkManagerProps> = ({ userRole }) => {
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [filter, setFilter] = useState('Active');
  
  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [submissionsList, setSubmissionsList] = useState<Submission[]>([]);

  const canCreate = userRole === UserRole.TEACHER || userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN;

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    dueDate: '',
    description: ''
  });

  // --- Assignment Management ---

  const handleOpenCreate = () => {
      setEditingId(null);
      setFormData({ title: '', subject: '', class: '', dueDate: '', description: '' });
      setIsModalOpen(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
      setEditingId(assignment.id);
      setFormData({
          title: assignment.title,
          subject: assignment.subject,
          class: assignment.class,
          dueDate: assignment.dueDate,
          description: assignment.description
      });
      setIsModalOpen(true);
  };

  const handleSave = () => {
    if(!formData.title || !formData.subject) return;
    
    if (editingId) {
        // Update existing
        setAssignments(prev => prev.map(a => a.id === editingId ? {
            ...a,
            ...formData
        } : a));
    } else {
        // Create new
        const assignment: Assignment = {
            id: Date.now().toString(),
            ...formData,
            teacher: 'Current User', // Mock
            assignDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            submissions: 0,
            totalStudents: 30
        };
        setAssignments([assignment, ...assignments]);
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
      if(window.confirm('Delete this assignment?')) {
          setAssignments(assignments.filter(a => a.id !== id));
      }
  };

  // --- Submission Management ---

  const handleViewSubmissions = (assignment: Assignment) => {
      setCurrentAssignment(assignment);
      
      // Mock submissions generation based on students
      const mockSubmissions: Submission[] = INITIAL_STUDENTS.map((student, index) => {
          const statuses: Submission['status'][] = ['Submitted', 'Pending', 'Late', 'Graded'];
          // Deterministic pseudo-random status based on assignment ID and student ID
          const statusIndex = (parseInt(assignment.id) + index) % 4; 
          const status = statuses[statusIndex];
          
          return {
              studentId: student.id,
              studentName: student.name,
              status: status,
              submissionDate: status !== 'Pending' ? '2023-10-21' : undefined,
              score: status === 'Graded' ? `${8 + (index % 3)}/10` : '',
              feedback: status === 'Graded' ? 'Good effort!' : ''
          };
      });
      
      setSubmissionsList(mockSubmissions);
      setIsSubmissionsModalOpen(true);
  };

  const handleUpdateSubmission = (studentId: string, field: keyof Submission, value: string) => {
      setSubmissionsList(prev => prev.map(sub => 
          sub.studentId === studentId ? { ...sub, [field]: value } : sub
      ));
  };

  const filteredAssignments = assignments.filter(a => a.status === filter);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Homework & Assignments</h1>
          <p className="text-slate-500">Manage tasks, track submissions, and grade projects.</p>
        </div>
        {canCreate && (
            <button 
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2"
            >
                <Plus size={18} /> Create Assignment
            </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-slate-200 pb-1">
          {['Active', 'Closed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative top-[1px] border-b-2 ${filter === status ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                  {status}
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
          {filteredAssignments.map(assignment => (
              <Card key={assignment.id} className="hover:border-indigo-300 transition-colors group">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                      <div className="flex-1">
                          <div className="flex items-start justify-between">
                              <div className="flex gap-3">
                                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl h-fit">
                                      <BookOpen size={24} />
                                  </div>
                                  <div>
                                      <h3 className="text-lg font-bold text-slate-800">{assignment.title}</h3>
                                      <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-1">
                                          <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{assignment.subject}</span>
                                          <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{assignment.class}</span>
                                          <span className="flex items-center gap-1"><User size={12}/> {assignment.teacher}</span>
                                      </div>
                                  </div>
                              </div>
                              {canCreate && (
                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => handleEditAssignment(assignment)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                        title="Edit Assignment"
                                      >
                                          <Edit size={18} />
                                      </button>
                                      <button 
                                        onClick={() => handleDelete(assignment.id)} 
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Delete Assignment"
                                      >
                                          <Trash2 size={18} />
                                      </button>
                                  </div>
                              )}
                          </div>
                          
                          <div className="mt-4 pl-[60px]">
                              <p className="text-slate-600 text-sm leading-relaxed">{assignment.description}</p>
                              <div className="flex items-center gap-4 mt-3 text-xs font-medium">
                                  <span className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2 py-1 rounded"><Calendar size={14}/> Assigned: {assignment.assignDate}</span>
                                  <span className={`flex items-center gap-1 px-2 py-1 rounded ${new Date(assignment.dueDate) < new Date() ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                      <Clock size={14}/> Due: {assignment.dueDate}
                                  </span>
                                  <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded"><Paperclip size={14}/> 2 Files Attached</span>
                              </div>
                          </div>
                      </div>

                      {/* Stats Column */}
                      <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-row md:flex-col justify-between items-center md:justify-center gap-4">
                          <div className="text-center">
                              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Submissions</p>
                              <div className="text-2xl font-bold text-slate-800">
                                  {assignment.submissions}<span className="text-sm text-slate-400 font-normal">/{assignment.totalStudents}</span>
                              </div>
                              <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 mx-auto overflow-hidden">
                                  <div className="h-full bg-emerald-500" style={{ width: `${(assignment.submissions/assignment.totalStudents)*100}%` }}></div>
                              </div>
                          </div>
                          <button 
                            onClick={() => handleViewSubmissions(assignment)}
                            className="w-full py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                          >
                              View Submissions
                          </button>
                      </div>
                  </div>
              </Card>
          ))}
          
          {filteredAssignments.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
                  <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                  <h3 className="text-slate-600 font-medium">No {filter.toLowerCase()} assignments found</h3>
                  {canCreate && <p className="text-slate-400 text-sm mt-1">Create a new assignment to get started.</p>}
              </div>
          )}
      </div>

      {/* Create/Edit Assignment Modal */}
      <Modal 
        title={editingId ? "Edit Assignment" : "Create New Assignment"} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        footer={
            <>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    {editingId ? "Save Changes" : "Publish Homework"}
                </button>
            </>
        }
      >
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assignment Title</label>
                  <input type="text" className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none" 
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Chapter 5 Review" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                      <select className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                        value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                          <option value="">Select...</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="English">English</option>
                          <option value="Science">Science</option>
                          <option value="History">History</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Target Class</label>
                      <select className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                        value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})}>
                          <option value="">Select...</option>
                          <option value="10-A">10-A</option>
                          <option value="10-B">10-B</option>
                          <option value="9-A">9-A</option>
                      </select>
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input type="date" className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
                    value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description & Instructions</label>
                  <textarea className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none h-32 resize-none"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detailed instructions for the students..." />
              </div>
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center cursor-pointer hover:bg-slate-100 transition-colors">
                  <Paperclip size={20} className="mx-auto text-slate-400 mb-1"/>
                  <span className="text-xs text-slate-500">Attach Reference Material (PDF, IMG)</span>
              </div>
          </div>
      </Modal>

      {/* Submissions Management Modal */}
      {isSubmissionsModalOpen && currentAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                  
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase tracking-wider">{currentAssignment.subject}</span>
                              <span className="text-xs font-bold text-slate-400">{currentAssignment.class}</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-800">{currentAssignment.title}</h3>
                          <p className="text-sm text-slate-500 mt-1">Manage grading and submission status for all students.</p>
                      </div>
                      <button onClick={() => setIsSubmissionsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><Trash2 className="hidden" /><span className="text-2xl leading-none">&times;</span></button>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-4 gap-4 p-4 bg-white border-b border-slate-100 text-center">
                      <div className="p-3 bg-emerald-50 rounded-xl">
                          <p className="text-xs text-emerald-600 font-bold uppercase">Graded</p>
                          <p className="text-xl font-bold text-slate-800">{submissionsList.filter(s => s.status === 'Graded').length}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-xl">
                          <p className="text-xs text-blue-600 font-bold uppercase">Submitted</p>
                          <p className="text-xl font-bold text-slate-800">{submissionsList.filter(s => s.status === 'Submitted').length}</p>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-xl">
                          <p className="text-xs text-amber-600 font-bold uppercase">Pending</p>
                          <p className="text-xl font-bold text-slate-800">{submissionsList.filter(s => s.status === 'Pending').length}</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-xl">
                          <p className="text-xs text-red-600 font-bold uppercase">Late</p>
                          <p className="text-xl font-bold text-slate-800">{submissionsList.filter(s => s.status === 'Late').length}</p>
                      </div>
                  </div>

                  {/* Submissions List */}
                  <div className="overflow-y-auto p-0 flex-1 custom-scrollbar">
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                              <tr>
                                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Student Name</th>
                                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Submission Date</th>
                                  <th className="p-4 text-xs font-bold text-slate-500 uppercase w-32">Score</th>
                                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Feedback</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-sm">
                              {submissionsList.map(sub => (
                                  <tr key={sub.studentId} className="hover:bg-slate-50 transition-colors group">
                                      <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                              {sub.studentName.charAt(0)}
                                          </div>
                                          {sub.studentName}
                                      </td>
                                      <td className="p-4">
                                          <select 
                                              value={sub.status}
                                              onChange={(e) => handleUpdateSubmission(sub.studentId, 'status', e.target.value)}
                                              className={`text-xs font-bold px-2 py-1 rounded-full border-none outline-none cursor-pointer appearance-none ${
                                                  sub.status === 'Graded' ? 'bg-emerald-100 text-emerald-700' :
                                                  sub.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                                                  sub.status === 'Late' ? 'bg-red-100 text-red-700' :
                                                  'bg-amber-100 text-amber-700'
                                              }`}
                                          >
                                              <option value="Pending">Pending</option>
                                              <option value="Submitted">Submitted</option>
                                              <option value="Late">Late</option>
                                              <option value="Graded">Graded</option>
                                          </select>
                                      </td>
                                      <td className="p-4 text-slate-500">
                                          {sub.submissionDate || '-'}
                                      </td>
                                      <td className="p-4">
                                          <input 
                                              type="text" 
                                              placeholder="0/10" 
                                              value={sub.score || ''}
                                              onChange={(e) => handleUpdateSubmission(sub.studentId, 'score', e.target.value)}
                                              className="w-16 p-1 border border-slate-200 rounded text-center focus:border-indigo-500 outline-none transition-all"
                                          />
                                      </td>
                                      <td className="p-4">
                                          <div className="flex items-center gap-2">
                                              <input 
                                                  type="text" 
                                                  placeholder="Add feedback..."
                                                  value={sub.feedback || ''}
                                                  onChange={(e) => handleUpdateSubmission(sub.studentId, 'feedback', e.target.value)}
                                                  className="w-full p-1 border-b border-transparent focus:border-indigo-300 bg-transparent focus:bg-white outline-none text-slate-600 text-sm transition-all"
                                              />
                                              <button className="text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <Save size={14} />
                                              </button>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                      <button 
                        onClick={() => setIsSubmissionsModalOpen(false)}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 font-medium"
                      >
                          Done Grading
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};