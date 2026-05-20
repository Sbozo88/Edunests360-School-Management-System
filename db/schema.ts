import { integer, jsonb, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const students = pgTable('students', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  class: text('class').notNull(),
  section: text('section').notNull(),
  parent: text('parent').notNull(),
  email: text('email').notNull(),
  status: text('status').default('Active'),
  attendance: integer('attendance').default(0),
  fee: text('fee').default('Pending'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const teachers = pgTable('teachers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  email: text('email').notNull(),
  status: text('status').default('Active'),
  classes: jsonb('classes').default([]),
  avatar: text('avatar'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const classes = pgTable('classes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  sectionId: text('section_id'),
  teacherId: text('teacher_id'),
  roomId: text('room_id'),
  shift: text('shift'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const routines = pgTable('routines', {
  id: text('id').primaryKey(),
  classId: text('class_id'),
  day: text('day').notNull(),
  timeSlot: text('time_slot').notNull(),
  subjectId: text('subject_id'),
  studentId: text('student_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  studentId: text('student_id'),
  description: text('description').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull(),
  date: text('date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
