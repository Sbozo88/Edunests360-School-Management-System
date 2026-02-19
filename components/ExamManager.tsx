import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { Calendar, FileText, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { UserRole } from '../types';

interface ExamManagerProps {
  userRole?: UserRole;
}

export const ExamManager: React.FC<ExamManagerProps> = ({ userRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exams, setExams] = useState([
    { id: 1, title: 'Mid-Term Mathematics', grade: 'Grade 10', date: 'Oct 10', time: '09:00 AM - 12:00 PM', hall: 'Hall A' },
    { id: 2, title: 'Physics Practical', grade: 'Grade 11', date: 'Oct 12', time: '10:00 AM - 01:00 PM', hall: 'Lab 2' },
    { id: 3, title: 'English Literature', grade: 'Grade 9', date: 'Oct 15', time: '09:00 AM - 11:30 AM', hall: 'Hall B' }
  ]);
  
  const [newExam, setNewExam] = useState({ title: '', grade: '', date: '', time: '', hall: '' });
  
  // Teachers and Admins can schedule exams
  const canSchedule = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN || userRole === UserRole.TEACHER;

  const handleAddExam = () => {
    if (!newExam.title || !newExam.date) return;
    setExams([...exams, { id: Date.now(), ...newExam }]);
    setIsModalOpen(false);
    setNewExam({ title: '', grade: '', date: '', time: '', hall: '' });
  };

  const handleDeleteExam = (id: number) => {
    if (window.confirm("Are you sure you want to cancel this exam? This action cannot be undone.")) {
        setExams(exams.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Examinations</h1>
        {canSchedule && (
            <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200"
            >
            + Schedule Exam
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-slate-700">Upcoming Exams</h3>
          {exams.map((exam) => (
             <Card key={exam.id} className="flex items-center gap-4">
               <div className="w-16 h-16 bg-red-50 rounded-xl flex flex-col items-center justify-center text-red-600 shrink-0">
                 <span className="text-xs font-bold uppercase">{exam.date.split(' ')[0]}</span>
                 <span className="text-2xl font-bold">{exam.date.split(' ')[1]}</span>
               </div>
               <div className="flex-1">
                 <h4 className="font-bold text-slate-800 text-lg">{exam.title}</h4>
                 <p className="text-slate-500 text-sm">{exam.grade} • {exam.time}</p>
               </div>
               <div className="hidden sm:block">
                 <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{exam.hall}</span>
               </div>
               {canSchedule && (
                   <button 
                     onClick={() => handleDeleteExam(exam.id)}
                     className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
                     title="Cancel Exam"
                   >
                       <Trash2 size={18} />
                   </button>
               )}
             </Card>
          ))}
          {exams.length === 0 && (
             <div className="text-center py-12 text-slate-500 bg-white/50 rounded-xl border border-dashed border-slate-200">
                No upcoming exams scheduled.
             </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="font-bold text-slate-700">Quick Actions</h3>
          <Card className="hover:bg-indigo-50 transition-colors cursor-pointer group">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                 <FileText size={20} />
               </div>
               <div>
                 <h4 className="font-bold text-slate-800 group-hover:text-indigo-700">Generate Admit Cards</h4>
                 <p className="text-xs text-slate-500">For upcoming Mid-Terms</p>
               </div>
             </div>
          </Card>
          {canSchedule && (
            <Card className="hover:bg-emerald-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-emerald-700">Publish Results</h4>
                    <p className="text-xs text-slate-500">Release Marks to Portal</p>
                </div>
                </div>
            </Card>
          )}
        </div>
      </div>

      <Modal title="Schedule New Exam" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        footer={
           <>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={handleAddExam} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200">Schedule</button>
           </>
        }
      >
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Exam Title</label>
                  <input type="text" value={newExam.title} onChange={(e) => setNewExam({...newExam, title: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100" placeholder="e.g. Final Mathematics" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Grade</label>
                    <input type="text" value={newExam.grade} onChange={(e) => setNewExam({...newExam, grade: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100" placeholder="e.g. Grade 10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hall/Room</label>
                    <input type="text" value={newExam.hall} onChange={(e) => setNewExam({...newExam, hall: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100" placeholder="e.g. Hall A" />
                  </div>
              </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input type="text" value={newExam.date} onChange={(e) => setNewExam({...newExam, date: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100" placeholder="e.g. Oct 20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                    <input type="text" value={newExam.time} onChange={(e) => setNewExam({...newExam, time: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100" placeholder="09:00 AM - 12:00 PM" />
                  </div>
              </div>
          </div>
      </Modal>
    </div>
  );
};