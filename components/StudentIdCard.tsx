import React, { useRef } from 'react';
import { Printer, X, Download } from 'lucide-react';
import { Student } from '../types';

interface StudentIdCardProps {
  student: Student | any; // accepting any for compatibility with local types
  schoolName?: string;
  schoolAddress?: string;
  onClose?: () => void;
}

export const StudentIdCard: React.FC<StudentIdCardProps> = ({ 
  student, 
  schoolName = "Edunets365 High School",
  schoolAddress = "123 Education Lane, Knowledge City",
  onClose
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = cardRef.current?.innerHTML;
    const printWindow = window.open('', '', 'height=700,width=500');
    
    if(printWindow) {
        printWindow.document.write(`
            <html>
                <head>
                    <title>Student ID - ${student.name}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                        .id-card-container { transform: scale(1); }
                        @media print {
                            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                    <script>
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 500);
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    }
  };

  // Mock data fallbacks
  const avatarUrl = student.avatar || `https://ui-avatars.com/api/?name=${student.name}&background=random&size=200`;
  const rollNo = student.rollNo || student.id.split('-')[1] || 'N/A';
  const bloodGroup = student.bloodGroup || 'O+';
  const dob = student.dob || '2008-01-01';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transform scale-100">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
             <h3 className="font-bold text-slate-800">Student ID Card</h3>
             <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium shadow-md shadow-indigo-200">
                    <Printer size={16} /> Print / PDF
                </button>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                )}
             </div>
          </div>
          
          <div className="p-8 flex justify-center bg-slate-100 overflow-y-auto custom-scrollbar">
              <div ref={cardRef} className="id-card-container">
                  {/* ID CARD DESIGN */}
                  <div className="w-[320px] h-[480px] bg-white rounded-xl shadow-xl overflow-hidden relative border border-slate-200 flex flex-col print:shadow-none print:border">
                      
                      {/* Header */}
                      <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center text-white p-4 text-center relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
                          
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-xl font-bold mb-1 shadow-sm border border-white/30 relative z-10">
                              E
                          </div>
                          <h2 className="font-bold text-lg leading-tight relative z-10">{schoolName}</h2>
                          <p className="text-[10px] opacity-80 mt-0.5 relative z-10">{schoolAddress}</p>
                      </div>

                      {/* Photo */}
                      <div className="relative -mt-12 flex justify-center mb-2 z-10">
                          <div className="w-28 h-28 rounded-full border-4 border-white shadow-md bg-slate-200 overflow-hidden">
                              <img 
                                src={avatarUrl} 
                                alt={student.name} 
                                className="w-full h-full object-cover"
                              />
                          </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col items-center text-center px-6 pb-4 pt-1">
                          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{student.name}</h1>
                          <span className="inline-block bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-4 border border-indigo-100">
                              STUDENT
                          </span>

                          <div className="w-full space-y-2 text-sm">
                              <div className="flex justify-between border-b border-slate-100 border-dashed pb-1.5">
                                  <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">ID Number</span>
                                  <span className="font-bold text-slate-700">{student.id}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 border-dashed pb-1.5">
                                  <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Class</span>
                                  <span className="font-bold text-slate-700">{student.class}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 border-dashed pb-1.5">
                                  <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Roll No.</span>
                                  <span className="font-bold text-slate-700">{rollNo}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 border-dashed pb-1.5">
                                  <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Blood Group</span>
                                  <span className="font-bold text-red-500">{bloodGroup}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 border-dashed pb-1.5">
                                  <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Valid Thru</span>
                                  <span className="font-bold text-slate-700">June 2026</span>
                              </div>
                          </div>
                      </div>

                      {/* Footer */}
                      <div className="h-14 bg-slate-50 border-t border-slate-100 flex flex-col items-center justify-center p-2">
                          <div className="w-32 h-6 bg-slate-800 opacity-10 rounded mb-1"></div>
                          <p className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold">Principal Signature</p>
                      </div>
                  </div>
              </div>
          </div>
       </div>
    </div>
  );
};