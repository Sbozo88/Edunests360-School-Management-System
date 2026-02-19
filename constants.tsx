import React from 'react';
import {
  LayoutDashboard, Users, BookOpen, Calendar,
  DollarSign, MessageSquare, Bus, Settings,
  Award, FileText, GraduationCap, Briefcase, User,
  CalendarCheck, ClipboardList
} from 'lucide-react';
import { NavItem, UserRole } from './types';

export const SIDEBAR_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    id: 'dashboard',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT]
  },
  {
    label: 'My Children',
    icon: User,
    id: 'parent-portal',
    allowedRoles: [UserRole.PARENT]
  },
  {
    label: 'Attendance',
    icon: CalendarCheck,
    id: 'attendance',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    label: 'Academic',
    icon: BookOpen,
    id: 'academic',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
    subItems: [
      { label: 'Classes', id: 'classes', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER] },
      { label: 'Subjects', id: 'subjects', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER] },
      { label: 'Timetable', id: 'timetable', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER] }
    ]
  },
  {
    label: 'Homework',
    icon: ClipboardList,
    id: 'homework',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT]
  },
  {
    label: 'Students',
    icon: Users,
    id: 'students',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
    subItems: [
      { label: 'All Students', id: 'student-list', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER] },
      { label: 'Admission', id: 'admission', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
      { label: 'Student Profile', id: 'student-profile', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER] },
    ]
  },
  {
    label: 'My Profile',
    icon: Users,
    id: 'student-profile',
    allowedRoles: [UserRole.STUDENT]
  },
  {
    label: 'Teachers',
    icon: GraduationCap,
    id: 'teachers',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    label: 'Staff & HR',
    icon: Briefcase,
    id: 'staff',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    label: 'Examinations',
    icon: Award,
    id: 'exams',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT]
  },
  {
    label: 'Finance',
    icon: () => <span style={{ fontSize: 18, fontWeight: 800, fontFamily: 'system-ui, sans-serif' }}>R</span>,
    id: 'finance',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PARENT],
    subItems: [
      { label: 'Invoices', id: 'fees', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PARENT] },
      { label: 'Expenses', id: 'expenses', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] }
    ]
  },
  {
    label: 'Transport',
    icon: Bus,
    id: 'transport',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PARENT, UserRole.STUDENT]
  },
  {
    label: 'Messages',
    icon: MessageSquare,
    id: 'messages',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT]
  },
  {
    label: 'Reports',
    icon: FileText,
    id: 'reports',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    label: 'Settings',
    icon: Settings,
    id: 'settings',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT]
  },
];