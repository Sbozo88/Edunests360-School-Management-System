INSERT INTO students (id, name, class, section, parent, email, status, attendance, fee) VALUES
  ('STD-001', 'Alex Morgan', '10', 'A', 'Robert Morgan', 'alex@school.com', 'Active', 92, 'Paid'),
  ('STD-002', 'Sarah Smith', '10', 'A', 'John Smith', 'sarah@school.com', 'Active', 88, 'Pending'),
  ('STD-003', 'Michael Brown', '9', 'B', 'Lisa Brown', 'michael@school.com', 'Inactive', 0, 'Paid'),
  ('STD-004', 'Emily Davis', '11', 'C', 'Mark Davis', 'emily@school.com', 'Active', 75, 'Overdue'),
  ('STD-005', 'James Wilson', '8', 'A', 'Paul Wilson', 'james@school.com', 'Active', 96, 'Paid'),
  ('STD-006', 'Jessica Jones', '10', 'A', 'Alias Jones', 'jessica@school.com', 'Active', 91, 'Paid')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  class = EXCLUDED.class,
  section = EXCLUDED.section,
  parent = EXCLUDED.parent,
  email = EXCLUDED.email,
  status = EXCLUDED.status,
  attendance = EXCLUDED.attendance,
  fee = EXCLUDED.fee;

INSERT INTO teachers (id, name, subject, email, status, classes) VALUES
  ('TCH-1002', 'Isaac Molelekwa', 'Violin Trainer', 'isaac@demo.com', 'Active', '["Beginner Violin","Intermediate Violin"]'::jsonb),
  ('TCH-1003', 'Vusi Hlatswayo', 'Violin Trainer', 'vusi@demo.com', 'Active', '["Advanced Violin","Orchestra A"]'::jsonb),
  ('TCH-1004', 'Gloria Boyi', 'Viola Trainer', 'gloria@demo.com', 'Active', '["Viola Basics","Ensemble B"]'::jsonb),
  ('TCH-1005', 'Bongane Kunene', 'Cello Trainer', 'skomomo@demo.com', 'Active', '["Cello Grade 1","Cello Grade 2"]'::jsonb),
  ('TCH-1006', 'Ponti Masekwa', 'Cello Trainer', 'masekwa@demo.com', 'Active', '["Cello Advanced","Chamber Music"]'::jsonb),
  ('TCH-1007', 'Ncobile', 'Flute Trainer', 'ncobile@demo.com', 'Active', '["Flute 101"]'::jsonb),
  ('TCH-1008', 'Thoko Thothobolo', 'Clarinet Trainer', 'thoko@demo.com', 'Active', '["Clarinet Basics"]'::jsonb),
  ('TCH-1009', 'Thokozani Mazibuko', 'Trumpet Trainer', 'thokoz@demo.com', 'Active', '["Brass Ensemble"]'::jsonb),
  ('TCH-1010', 'Nkuli Shiburi', 'Recorder', 'nkuli@gmail.com', 'Active', '["Recorder Grade 1","Recorder Grade 2"]'::jsonb),
  ('TCH-1011', 'Nomonde JPO', 'Music Theory Trainer', 'nomonder@demo.com', 'Active', '["Theory Lvl 1","Theory Lvl 2"]'::jsonb),
  ('TCH-1012', 'Gontse Segona', 'Marimba + Perc Trainer', 'gontse@demo.com', 'Active', '["Percussion Group","Marimba Band"]'::jsonb),
  ('TCH-1013', 'Thami Maseko', 'Dance Trainer', 'thami@demo.com', 'Active', '["Contemporary Dance","Ballet Basics"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subject = EXCLUDED.subject,
  email = EXCLUDED.email,
  status = EXCLUDED.status,
  classes = EXCLUDED.classes;

INSERT INTO classes (id, name, section_id, teacher_id, room_id, shift) VALUES
  ('CLS-01', 'Violin A', 'SEC-01', 'TCH-1002', 'RM-2', 'Morning'),
  ('CLS-02', 'Violin B', 'SEC-01', 'TCH-1002', 'RM-2', 'Morning'),
  ('CLS-03', 'Viola', 'SEC-01', 'TCH-1004', 'RM-2', 'Day'),
  ('CLS-04', 'Cello', 'SEC-01', 'TCH-1005', 'RM-1', 'Day'),
  ('CLS-05', 'Flute', 'SEC-01', 'TCH-1007', 'RM-2', 'Morning'),
  ('CLS-06', 'Clarinet', 'SEC-01', 'TCH-1008', 'RM-2', 'Morning'),
  ('CLS-07', 'Trumpet', 'SEC-01', 'TCH-1009', 'RM-1', 'Evening'),
  ('CLS-08', 'Marimba', 'SEC-01', 'TCH-1012', 'RM-1', 'Evening'),
  ('CLS-09', 'Recorder', 'SEC-01', 'TCH-1010', 'RM-4', 'Morning'),
  ('CLS-10', 'Music Theory I', 'SEC-03', 'TCH-1011', 'RM-1', 'Day'),
  ('CLS-11', 'Contemporary Dance', 'SEC-02', 'TCH-1013', 'RM-3', 'Evening')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  section_id = EXCLUDED.section_id,
  teacher_id = EXCLUDED.teacher_id,
  room_id = EXCLUDED.room_id,
  shift = EXCLUDED.shift;

INSERT INTO routines (id, class_id, day, time_slot, subject_id, student_id) VALUES
  ('RT-001', 'CLS-01', 'Saturday', '08:30 AM', 'SUB-01', 'STD-001'),
  ('RT-002', 'CLS-01', 'Saturday', '09:00 AM', 'SUB-01', NULL),
  ('RT-003', 'CLS-01', 'Saturday', '09:30 AM', 'SUB-02', NULL),
  ('RT-004', 'CLS-01', 'Saturday', '10:00 AM', 'SUB-01', 'STD-002')
ON CONFLICT (id) DO UPDATE SET
  class_id = EXCLUDED.class_id,
  day = EXCLUDED.day,
  time_slot = EXCLUDED.time_slot,
  subject_id = EXCLUDED.subject_id,
  student_id = EXCLUDED.student_id;

INSERT INTO invoices (id, student_id, description, amount, status, date) VALUES
  ('1', 'STD-001', 'Tuition', 8100, 'Paid', '24 Oct 2023'),
  ('2', 'STD-002', 'Transport', 2160, 'Pending', '25 Oct 2023'),
  ('3', 'STD-003', 'Tuition', 36000, 'Overdue', '01 Sep 2023'),
  ('4', 'STD-004', 'Library', 900, 'Unpaid', '26 Oct 2023'),
  ('5', 'STD-005', 'Tuition', 8100, 'Paid', '24 Oct 2023')
ON CONFLICT (id) DO UPDATE SET
  student_id = EXCLUDED.student_id,
  description = EXCLUDED.description,
  amount = EXCLUDED.amount,
  status = EXCLUDED.status,
  date = EXCLUDED.date;
