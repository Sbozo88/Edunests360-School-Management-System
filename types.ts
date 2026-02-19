export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

export interface NavItem {
  label: string;
  icon: any;
  id: string;
  allowedRoles?: UserRole[];
  subItems?: { label: string; id: string; allowedRoles?: UserRole[] }[];
}

export interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  guardian: string;
  status: 'Active' | 'Inactive';
  avatar: string;
  fee: string;
  parent: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  studentName: string;
  studentId: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Pending' | 'Overdue';
  date: string;
  type: 'Tuition' | 'Transport' | 'Library' | 'Exam';
}

export interface ChartDataPoint {
  name: string;
  income?: number;
  expense?: number;
  students?: number;
  attendance?: number;
}