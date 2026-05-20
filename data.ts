import { Invoice } from './types';

export const SCHOOL_PROFILE = {
  name: 'Rembrandt Park School',
  shortName: 'RPS',
  motto: 'Striving for EXCELLENCE',
  sector: 'Public Primary School',
  classification: 'Quintile 5 Ordinary School',
  emisNumber: '700151340',
  physicalAddress: '30 Heine Road, Rembrandt Park, Johannesburg, 2090',
  postalAddress: 'P O Box 890789, Lyndhurst, 2106',
  contactNumber: '011 882 4002',
  emails: ['pa@rempark.co.za', 'rpschool@iburst.co.za'],
  operatingHours: 'Weekdays 07:30-16:00',
  dismissalTimes: {
    gradeR: '13:15',
    foundationPhase: '13:30',
    intersenPhase: '13:45',
  },
  standardAnnualFee: 14500,
};

export const TERM_DATES_2026 = [
  { term: 'Term 1', dates: '14 Jan - 27 Mar' },
  { term: 'Term 2', dates: '8 Apr - 26 Jun' },
  { term: 'Term 3', dates: '21 Jul - 23 Sep' },
  { term: 'Term 4', dates: '6 Oct - 9 Dec' },
];

export const EXTRA_CURRICULARS = [
  'Soccer',
  'Netball',
  'Swimming',
  'Kung fu',
  'Coding and Robotics',
  'Maths 24',
  'Spelling bees',
  'Hooked on Books',
  'Art activities for Grades 4-7',
  'Music lessons',
];

export const ANNUAL_EVENTS = [
  'Sports Day',
  'Concerts',
  'Science fairs',
  'Grade 6 camps',
  'Market Day',
  'Heritage Day',
  'Gala',
];

export const INITIAL_STUDENTS = [
  { id: 'RPS-001', name: 'Sithembiso', class: '7T', parent: 'RPS Parent 1', status: 'Active', fee: 'Paid', email: 'sithembiso@rempark.co.za', attendance: 96 },
  { id: 'RPS-002', name: 'Siyamthanda', class: '7N', parent: 'RPS Parent 2', status: 'Active', fee: 'Paid', email: 'siyamthanda@rempark.co.za', attendance: 95 },
  { id: 'RPS-003', name: 'Sihle', class: '7S', parent: 'RPS Parent 3', status: 'Active', fee: 'Pending', email: 'sihle@rempark.co.za', attendance: 92 },
  { id: 'RPS-004', name: 'Shawn', class: '7A', parent: 'RPS Parent 4', status: 'Active', fee: 'Pending', email: 'shawn@rempark.co.za', attendance: 91 },
  { id: 'RPS-005', name: 'Lerato Mokoena', class: '4M', parent: 'Thandi Mokoena', status: 'Active', fee: 'Paid', email: 'lerato.mokoena@rempark.co.za', attendance: 94 },
  { id: 'RPS-006', name: 'Aarav Naidoo', class: '3N', parent: 'Priya Naidoo', status: 'Active', fee: 'Overdue', email: 'aarav.naidoo@rempark.co.za', attendance: 89 },
  { id: 'RPS-007', name: 'Amara Dlamini', class: '2S', parent: 'Nomsa Dlamini', status: 'Active', fee: 'Paid', email: 'amara.dlamini@rempark.co.za', attendance: 97 },
  { id: 'RPS-008', name: 'Mia Patel', class: 'RA', parent: 'Kiran Patel', status: 'Active', fee: 'Pending', email: 'mia.patel@rempark.co.za', attendance: 93 },
];

export const INITIAL_TEACHERS = [
  { id: 'TCH-001', name: 'Ms Seema', subject: 'Principal', classes: ['School Management'], email: 'pa@rempark.co.za', status: 'Active' },
  { id: 'TCH-002', name: 'Ms Kendall', subject: 'Deputy Principal', classes: ['Foundation Phase Oversight'], email: 'kendall@rempark.co.za', status: 'Active' },
  { id: 'TCH-003', name: 'Mr Chidi', subject: 'Deputy Principal', classes: ['Intersen Phase Oversight'], email: 'chidi@rempark.co.za', status: 'Active' },
  { id: 'TCH-004', name: 'Ms Naicker', subject: 'Departmental Head - Foundation Phase', classes: ['Grade R', 'Grade 1'], email: 'naicker@rempark.co.za', status: 'Active' },
  { id: 'TCH-005', name: 'Ms Pope', subject: 'Departmental Head - Foundation Phase', classes: ['Grade 2'], email: 'pope@rempark.co.za', status: 'Active' },
  { id: 'TCH-006', name: 'Ms Meikle', subject: 'Departmental Head - Foundation Phase', classes: ['Grade 3'], email: 'meikle@rempark.co.za', status: 'Active' },
  { id: 'TCH-007', name: 'Ms Slaughter', subject: 'Departmental Head - Intersen Phase', classes: ['Grade 4'], email: 'slaughter@rempark.co.za', status: 'Active' },
  { id: 'TCH-008', name: 'Ms Cierenberg', subject: 'Departmental Head - Intersen Phase', classes: ['Grade 5', 'Grade 6'], email: 'cierenberg@rempark.co.za', status: 'Active' },
  { id: 'TCH-009', name: 'Ms Vilakazi', subject: 'Departmental Head - Intersen Phase', classes: ['Grade 7'], email: 'vilakazi@rempark.co.za', status: 'Active' },
  { id: 'TCH-010', name: 'Ms Maphutha', subject: 'Media Centre', classes: ['Library', 'Reading Support'], email: 'maphutha@rempark.co.za', status: 'Active' },
  { id: 'TCH-011', name: 'Mr Ndivhuwo', subject: 'Media Centre', classes: ['Library', 'Hooked on Books'], email: 'ndivhuwo@rempark.co.za', status: 'Active' },
  { id: 'TCH-012', name: 'Mr Mokoena', subject: 'Computers', classes: ['Coding and Robotics'], email: 'mokoena@rempark.co.za', status: 'Active' },
  { id: 'TCH-013', name: 'Ms Masinga', subject: 'Zulu Grades 1-3', classes: ['Grade 1 Zulu', 'Grade 2 Zulu', 'Grade 3 Zulu'], email: 'masinga@rempark.co.za', status: 'Active' },
  { id: 'TCH-014', name: "Ms D'Aquino", subject: 'Sport', classes: ['Soccer', 'Netball', 'Swimming'], email: 'daquino@rempark.co.za', status: 'Active' },
  { id: 'TCH-015', name: 'Mr Ngwenya', subject: 'Music', classes: ['Music lessons', 'Concerts'], email: 'ngwenya@rempark.co.za', status: 'Active' },
  { id: 'TCH-016', name: 'Ms Moshape', subject: 'First Additional Language Grade 3', classes: ['Grade 3 FAL'], email: 'moshape@rempark.co.za', status: 'Active' },
];

export const INITIAL_STAFF = [
  { id: 'STF-001', name: 'Mr Skhosana', role: 'Administrator', department: 'Administration', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-002', name: 'Ms Ramarumo', role: 'Administrator', department: 'Administration', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-003', name: 'Mr Mathabatha', role: 'Administrator', department: 'Administration', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-004', name: 'Ms Mkhize', role: 'Administrator', department: 'Administration', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-005', name: 'Ms McGee', role: 'School Fees', department: 'Finance', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-006', name: 'Mr Makwarela', role: 'School Fees', department: 'Finance', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-007', name: 'Ms Waller', role: 'Finance', department: 'Finance', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-008', name: 'Godfrey', role: 'Grounds Staff', department: 'Grounds', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-009', name: 'Sarah', role: 'Grounds Staff', department: 'Grounds', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-010', name: 'Alfred', role: 'Grounds Staff', department: 'Grounds', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-011', name: 'Lucas', role: 'Grounds Staff', department: 'Grounds', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-012', name: 'Anikie', role: 'Grounds Staff', department: 'Grounds', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-013', name: 'Sophy', role: 'Grounds Staff', department: 'Grounds', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-014', name: 'Evidence', role: 'Grounds Staff', department: 'Grounds', phone: '011 882 4002', status: 'Active' },
  { id: 'STF-015', name: 'Ernest', role: 'Grounds Staff', department: 'Grounds', phone: '011 882 4002', status: 'Active' },
];

export const INITIAL_INVOICES: Invoice[] = [
  { id: '1', invoiceNo: 'INV-001', studentName: 'Sithembiso', studentId: 'RPS-001', amount: 14500, status: 'Paid', date: '14 Jan 2026', type: 'School Fees' },
  { id: '2', invoiceNo: 'INV-002', studentName: 'Siyamthanda', studentId: 'RPS-002', amount: 14500, status: 'Paid', date: '14 Jan 2026', type: 'School Fees' },
  { id: '3', invoiceNo: 'INV-003', studentName: 'Sihle', studentId: 'RPS-003', amount: 7250, status: 'Pending', date: '8 Apr 2026', type: 'School Fees' },
  { id: '4', invoiceNo: 'INV-004', studentName: 'Shawn', studentId: 'RPS-004', amount: 7250, status: 'Pending', date: '8 Apr 2026', type: 'School Fees' },
  { id: '5', invoiceNo: 'INV-005', studentName: 'Aarav Naidoo', studentId: 'RPS-006', amount: 14500, status: 'Overdue', date: '14 Jan 2026', type: 'School Fees' },
];

export const INITIAL_CLASSES = [
  { id: 'CLS-RA', name: 'RA', sectionId: 'SEC-FP', teacherId: 'TCH-004', roomId: 'Room 5', shift: 'Foundation Phase' },
  { id: 'CLS-RB', name: 'RB', sectionId: 'SEC-FP', teacherId: 'TCH-004', roomId: 'Room 6', shift: 'Foundation Phase' },
  { id: 'CLS-1C', name: '1C', sectionId: 'SEC-FP', teacherId: 'TCH-004', roomId: 'Room 1', shift: 'Foundation Phase' },
  { id: 'CLS-1M', name: '1M', sectionId: 'SEC-FP', teacherId: 'TCH-004', roomId: 'Room 7', shift: 'Foundation Phase' },
  { id: 'CLS-1J', name: '1J', sectionId: 'SEC-FP', teacherId: 'TCH-004', roomId: 'Room 8', shift: 'Foundation Phase' },
  { id: 'CLS-1N', name: '1N', sectionId: 'SEC-FP', teacherId: 'TCH-004', roomId: 'Room 9', shift: 'Foundation Phase' },
  { id: 'CLS-1P', name: '1P', sectionId: 'SEC-FP', teacherId: 'TCH-004', roomId: 'Room 10', shift: 'Foundation Phase' },
  { id: 'CLS-2S', name: '2S', sectionId: 'SEC-FP', teacherId: 'TCH-005', roomId: 'Room 2', shift: 'Foundation Phase' },
  { id: 'CLS-2F', name: '2F', sectionId: 'SEC-FP', teacherId: 'TCH-005', roomId: 'Room 31', shift: 'Foundation Phase' },
  { id: 'CLS-2N', name: '2N', sectionId: 'SEC-FP', teacherId: 'TCH-005', roomId: 'Room 32', shift: 'Foundation Phase' },
  { id: 'CLS-2T', name: '2T', sectionId: 'SEC-FP', teacherId: 'TCH-005', roomId: 'Room 33', shift: 'Foundation Phase' },
  { id: 'CLS-3N', name: '3N', sectionId: 'SEC-FP', teacherId: 'TCH-006', roomId: 'Room 3', shift: 'Foundation Phase' },
  { id: 'CLS-3M', name: '3M', sectionId: 'SEC-FP', teacherId: 'TCH-006', roomId: 'Room 4', shift: 'Foundation Phase' },
  { id: 'CLS-3D', name: '3D', sectionId: 'SEC-FP', teacherId: 'TCH-006', roomId: 'Room 29', shift: 'Foundation Phase' },
  { id: 'CLS-3A', name: '3A', sectionId: 'SEC-FP', teacherId: 'TCH-006', roomId: 'Room 30', shift: 'Foundation Phase' },
  { id: 'CLS-4M', name: '4M', sectionId: 'SEC-IP', teacherId: 'TCH-007', roomId: 'Room 11', shift: 'Intersen Phase' },
  { id: 'CLS-4K', name: '4K', sectionId: 'SEC-IP', teacherId: 'TCH-007', roomId: 'Room 12', shift: 'Intersen Phase' },
  { id: 'CLS-4S', name: '4S', sectionId: 'SEC-IP', teacherId: 'TCH-007', roomId: 'Room 13', shift: 'Intersen Phase' },
  { id: 'CLS-4R', name: '4R', sectionId: 'SEC-IP', teacherId: 'TCH-007', roomId: 'Room 14', shift: 'Intersen Phase' },
  { id: 'CLS-5L', name: '5L', sectionId: 'SEC-IP', teacherId: 'TCH-008', roomId: 'Room 16', shift: 'Intersen Phase' },
  { id: 'CLS-5K', name: '5K', sectionId: 'SEC-IP', teacherId: 'TCH-008', roomId: 'Room 17', shift: 'Intersen Phase' },
  { id: 'CLS-5N', name: '5N', sectionId: 'SEC-IP', teacherId: 'TCH-008', roomId: 'Room 18', shift: 'Intersen Phase' },
  { id: 'CLS-5M', name: '5M', sectionId: 'SEC-IP', teacherId: 'TCH-008', roomId: 'Room 26', shift: 'Intersen Phase' },
  { id: 'CLS-6Z', name: '6Z', sectionId: 'SEC-IP', teacherId: 'TCH-008', roomId: 'Room 23', shift: 'Intersen Phase' },
  { id: 'CLS-6V', name: '6V', sectionId: 'SEC-IP', teacherId: 'TCH-008', roomId: 'Room 24', shift: 'Intersen Phase' },
  { id: 'CLS-6M', name: '6M', sectionId: 'SEC-IP', teacherId: 'TCH-008', roomId: 'Room 25', shift: 'Intersen Phase' },
  { id: 'CLS-6B', name: '6B', sectionId: 'SEC-IP', teacherId: 'TCH-008', roomId: 'Room 27', shift: 'Intersen Phase' },
  { id: 'CLS-7T', name: '7T', sectionId: 'SEC-IP', teacherId: 'TCH-009', roomId: 'Room 15', shift: 'Intersen Phase' },
  { id: 'CLS-7N', name: '7N', sectionId: 'SEC-IP', teacherId: 'TCH-009', roomId: 'Room 19', shift: 'Intersen Phase' },
  { id: 'CLS-7S', name: '7S', sectionId: 'SEC-IP', teacherId: 'TCH-009', roomId: 'Room 20', shift: 'Intersen Phase' },
  { id: 'CLS-7A', name: '7A', sectionId: 'SEC-IP', teacherId: 'TCH-009', roomId: 'Room 21', shift: 'Intersen Phase' },
  { id: 'CLS-7M', name: '7M', sectionId: 'SEC-IP', teacherId: 'TCH-009', roomId: 'Room 22', shift: 'Intersen Phase' },
];

export const INITIAL_ROUTINES = [
  { id: 'RT-001', classId: 'CLS-RA', day: 'Monday', timeSlot: '07:30 AM', subjectId: 'SUB-FOUNDATION', studentId: 'RPS-008' },
  { id: 'RT-002', classId: 'CLS-3N', day: 'Monday', timeSlot: '08:30 AM', subjectId: 'SUB-FAL', studentId: 'RPS-006' },
  { id: 'RT-003', classId: 'CLS-4M', day: 'Tuesday', timeSlot: '09:30 AM', subjectId: 'SUB-CODING', studentId: 'RPS-005' },
  { id: 'RT-004', classId: 'CLS-7T', day: 'Wednesday', timeSlot: '10:30 AM', subjectId: 'SUB-LEADERSHIP', studentId: 'RPS-001' },
  { id: 'RT-005', classId: 'CLS-7N', day: 'Thursday', timeSlot: '11:30 AM', subjectId: 'SUB-SPORT', studentId: 'RPS-002' },
];
