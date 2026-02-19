import { Invoice } from './types';

export const INITIAL_STUDENTS = [
  { id: 'STD-001', name: 'Alex Morgan', class: '10-A', parent: 'Robert Morgan', status: 'Active', fee: 'Paid', email: 'alex@school.com', attendance: 92 },
  { id: 'STD-002', name: 'Sarah Smith', class: '10-A', parent: 'John Smith', status: 'Active', fee: 'Pending', email: 'sarah@school.com', attendance: 88 },
  { id: 'STD-003', name: 'Michael Brown', class: '9-B', parent: 'Lisa Brown', status: 'Inactive', fee: 'Paid', email: 'michael@school.com', attendance: 0 },
  { id: 'STD-004', name: 'Emily Davis', class: '11-C', parent: 'Mark Davis', status: 'Active', fee: 'Overdue', email: 'emily@school.com', attendance: 75 },
  { id: 'STD-005', name: 'James Wilson', class: '8-A', parent: 'Paul Wilson', status: 'Active', fee: 'Paid', email: 'james@school.com', attendance: 96 },
  { id: 'STD-006', name: 'Jessica Jones', class: '10-A', parent: 'Alias Jones', status: 'Active', fee: 'Paid', email: 'jessica@school.com', attendance: 91 },
];

export const INITIAL_TEACHERS = [
  { id: 'TCH-1002', name: 'Isaac Molelekwa', subject: 'Violin Trainer', classes: ['Beginner Violin', 'Intermediate Violin'], email: 'isaac@demo.com', status: 'Active' },
  { id: 'TCH-1003', name: 'Vusi Hlatswayo', subject: 'Violin Trainer', classes: ['Advanced Violin', 'Orchestra A'], email: 'vusi@demo.com', status: 'Active' },
  { id: 'TCH-1004', name: 'Gloria Boyi', subject: 'Viola Trainer', classes: ['Viola Basics', 'Ensemble B'], email: 'gloria@demo.com', status: 'Active' },
  { id: 'TCH-1005', name: 'Bongane Kunene', subject: 'Cello Trainer', classes: ['Cello Grade 1', 'Cello Grade 2'], email: 'skomomo@demo.com', status: 'Active' },
  { id: 'TCH-1006', name: 'Ponti Masekwa', subject: 'Cello Trainer', classes: ['Cello Advanced', 'Chamber Music'], email: 'masekwa@demo.com', status: 'Active' },
  { id: 'TCH-1007', name: 'Ncobile', subject: 'Flute Trainer', classes: ['Flute 101'], email: 'ncobile@demo.com', status: 'Active' },
  { id: 'TCH-1008', name: 'Thoko Thothobolo', subject: 'Clarinet Trainer', classes: ['Clarinet Basics'], email: 'thoko@demo.com', status: 'Active' },
  { id: 'TCH-1009', name: 'Thokozani Mazibuko', subject: 'Trumpet Trainer', classes: ['Brass Ensemble'], email: 'thokoz@demo.com', status: 'Active' },
  { id: 'TCH-1010', name: 'Nkuli Shiburi', subject: 'Recorder', classes: ['Recorder Grade 1', 'Recorder Grade 2'], email: 'nkuli@gmail.com', status: 'Active' },
  { id: 'TCH-1011', name: 'Nomonde JPO', subject: 'Music Theory Trainer', classes: ['Theory Lvl 1', 'Theory Lvl 2'], email: 'nomonder@demo.com', status: 'Active' },
  { id: 'TCH-1012', name: 'Gontse Segona', subject: 'Marimba + Perc Trainer', classes: ['Percussion Group', 'Marimba Band'], email: 'gontse@demo.com', status: 'Active' },
  { id: 'TCH-1013', name: 'Thami Maseko', subject: 'Dance Trainer', classes: ['Contemporary Dance', 'Ballet Basics'], email: 'thami@demo.com', status: 'Active' },
];

export const INITIAL_STAFF = [
  { id: 'STF-1001', name: 'Lehlohonolo Mokoena', role: 'Music Director', department: 'Management', phone: '814325083', status: 'Active' },
  { id: 'STF-1014', name: 'Lehlohonolo Mokoena', role: 'Music Director', department: 'Management', phone: '814325083', status: 'Active' },
];

export const INITIAL_INVOICES: Invoice[] = [
  { id: '1', invoiceNo: 'INV-001', studentName: 'Alex Morgan', studentId: 'STD-001', amount: 8100, status: 'Paid', date: '24 Oct 2023', type: 'Tuition' },
  { id: '2', invoiceNo: 'INV-002', studentName: 'Sarah Smith', studentId: 'STD-002', amount: 2160, status: 'Pending', date: '25 Oct 2023', type: 'Transport' },
  { id: '3', invoiceNo: 'INV-003', studentName: 'Michael Johnson', studentId: 'STD-003', amount: 36000, status: 'Overdue', date: '01 Sep 2023', type: 'Tuition' },
  { id: '4', invoiceNo: 'INV-004', studentName: 'Emily Davis', studentId: 'STD-004', amount: 900, status: 'Unpaid', date: '26 Oct 2023', type: 'Library' },
  { id: '5', invoiceNo: 'INV-005', studentName: 'James Wilson', studentId: 'STD-005', amount: 8100, status: 'Paid', date: '24 Oct 2023', type: 'Tuition' },
];