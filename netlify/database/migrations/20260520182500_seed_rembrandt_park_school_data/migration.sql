DELETE FROM routines;
DELETE FROM invoices;
DELETE FROM classes;
DELETE FROM teachers;
DELETE FROM students;

INSERT INTO students (id, name, class, section, parent, email, status, attendance, fee) VALUES
  ('RPS-001', 'Sithembiso', '7T', 'T', 'RPS Parent 1', 'sithembiso@rempark.co.za', 'Active', 96, 'Paid'),
  ('RPS-002', 'Siyamthanda', '7N', 'N', 'RPS Parent 2', 'siyamthanda@rempark.co.za', 'Active', 95, 'Paid'),
  ('RPS-003', 'Sihle', '7S', 'S', 'RPS Parent 3', 'sihle@rempark.co.za', 'Active', 92, 'Pending'),
  ('RPS-004', 'Shawn', '7A', 'A', 'RPS Parent 4', 'shawn@rempark.co.za', 'Active', 91, 'Pending'),
  ('RPS-005', 'Lerato Mokoena', '4M', 'M', 'Thandi Mokoena', 'lerato.mokoena@rempark.co.za', 'Active', 94, 'Paid'),
  ('RPS-006', 'Aarav Naidoo', '3N', 'N', 'Priya Naidoo', 'aarav.naidoo@rempark.co.za', 'Active', 89, 'Overdue'),
  ('RPS-007', 'Amara Dlamini', '2S', 'S', 'Nomsa Dlamini', 'amara.dlamini@rempark.co.za', 'Active', 97, 'Paid'),
  ('RPS-008', 'Mia Patel', 'RA', 'A', 'Kiran Patel', 'mia.patel@rempark.co.za', 'Active', 93, 'Pending');

INSERT INTO teachers (id, name, subject, email, status, classes) VALUES
  ('TCH-001', 'Ms Seema', 'Principal', 'pa@rempark.co.za', 'Active', '["School Management"]'::jsonb),
  ('TCH-002', 'Ms Kendall', 'Deputy Principal', 'kendall@rempark.co.za', 'Active', '["Foundation Phase Oversight"]'::jsonb),
  ('TCH-003', 'Mr Chidi', 'Deputy Principal', 'chidi@rempark.co.za', 'Active', '["Intersen Phase Oversight"]'::jsonb),
  ('TCH-004', 'Ms Naicker', 'Departmental Head - Foundation Phase', 'naicker@rempark.co.za', 'Active', '["Grade R","Grade 1"]'::jsonb),
  ('TCH-005', 'Ms Pope', 'Departmental Head - Foundation Phase', 'pope@rempark.co.za', 'Active', '["Grade 2"]'::jsonb),
  ('TCH-006', 'Ms Meikle', 'Departmental Head - Foundation Phase', 'meikle@rempark.co.za', 'Active', '["Grade 3"]'::jsonb),
  ('TCH-007', 'Ms Slaughter', 'Departmental Head - Intersen Phase', 'slaughter@rempark.co.za', 'Active', '["Grade 4"]'::jsonb),
  ('TCH-008', 'Ms Cierenberg', 'Departmental Head - Intersen Phase', 'cierenberg@rempark.co.za', 'Active', '["Grade 5","Grade 6"]'::jsonb),
  ('TCH-009', 'Ms Vilakazi', 'Departmental Head - Intersen Phase', 'vilakazi@rempark.co.za', 'Active', '["Grade 7"]'::jsonb),
  ('TCH-010', 'Ms Maphutha', 'Media Centre', 'maphutha@rempark.co.za', 'Active', '["Library","Reading Support"]'::jsonb),
  ('TCH-011', 'Mr Ndivhuwo', 'Media Centre', 'ndivhuwo@rempark.co.za', 'Active', '["Library","Hooked on Books"]'::jsonb),
  ('TCH-012', 'Mr Mokoena', 'Computers', 'mokoena@rempark.co.za', 'Active', '["Coding and Robotics"]'::jsonb),
  ('TCH-013', 'Ms Masinga', 'Zulu Grades 1-3', 'masinga@rempark.co.za', 'Active', '["Grade 1 Zulu","Grade 2 Zulu","Grade 3 Zulu"]'::jsonb),
  ('TCH-014', 'Ms D''Aquino', 'Sport', 'daquino@rempark.co.za', 'Active', '["Soccer","Netball","Swimming"]'::jsonb),
  ('TCH-015', 'Mr Ngwenya', 'Music', 'ngwenya@rempark.co.za', 'Active', '["Music lessons","Concerts"]'::jsonb),
  ('TCH-016', 'Ms Moshape', 'First Additional Language Grade 3', 'moshape@rempark.co.za', 'Active', '["Grade 3 FAL"]'::jsonb);

INSERT INTO classes (id, name, section_id, teacher_id, room_id, shift) VALUES
  ('CLS-RA', 'RA', 'SEC-FP', 'TCH-004', 'Room 5', 'Foundation Phase'),
  ('CLS-RB', 'RB', 'SEC-FP', 'TCH-004', 'Room 6', 'Foundation Phase'),
  ('CLS-1C', '1C', 'SEC-FP', 'TCH-004', 'Room 1', 'Foundation Phase'),
  ('CLS-1M', '1M', 'SEC-FP', 'TCH-004', 'Room 7', 'Foundation Phase'),
  ('CLS-1J', '1J', 'SEC-FP', 'TCH-004', 'Room 8', 'Foundation Phase'),
  ('CLS-1N', '1N', 'SEC-FP', 'TCH-004', 'Room 9', 'Foundation Phase'),
  ('CLS-1P', '1P', 'SEC-FP', 'TCH-004', 'Room 10', 'Foundation Phase'),
  ('CLS-2S', '2S', 'SEC-FP', 'TCH-005', 'Room 2', 'Foundation Phase'),
  ('CLS-2F', '2F', 'SEC-FP', 'TCH-005', 'Room 31', 'Foundation Phase'),
  ('CLS-2N', '2N', 'SEC-FP', 'TCH-005', 'Room 32', 'Foundation Phase'),
  ('CLS-2T', '2T', 'SEC-FP', 'TCH-005', 'Room 33', 'Foundation Phase'),
  ('CLS-3N', '3N', 'SEC-FP', 'TCH-006', 'Room 3', 'Foundation Phase'),
  ('CLS-3M', '3M', 'SEC-FP', 'TCH-006', 'Room 4', 'Foundation Phase'),
  ('CLS-3D', '3D', 'SEC-FP', 'TCH-006', 'Room 29', 'Foundation Phase'),
  ('CLS-3A', '3A', 'SEC-FP', 'TCH-006', 'Room 30', 'Foundation Phase'),
  ('CLS-4M', '4M', 'SEC-IP', 'TCH-007', 'Room 11', 'Intersen Phase'),
  ('CLS-4K', '4K', 'SEC-IP', 'TCH-007', 'Room 12', 'Intersen Phase'),
  ('CLS-4S', '4S', 'SEC-IP', 'TCH-007', 'Room 13', 'Intersen Phase'),
  ('CLS-4R', '4R', 'SEC-IP', 'TCH-007', 'Room 14', 'Intersen Phase'),
  ('CLS-5L', '5L', 'SEC-IP', 'TCH-008', 'Room 16', 'Intersen Phase'),
  ('CLS-5K', '5K', 'SEC-IP', 'TCH-008', 'Room 17', 'Intersen Phase'),
  ('CLS-5N', '5N', 'SEC-IP', 'TCH-008', 'Room 18', 'Intersen Phase'),
  ('CLS-5M', '5M', 'SEC-IP', 'TCH-008', 'Room 26', 'Intersen Phase'),
  ('CLS-6Z', '6Z', 'SEC-IP', 'TCH-008', 'Room 23', 'Intersen Phase'),
  ('CLS-6V', '6V', 'SEC-IP', 'TCH-008', 'Room 24', 'Intersen Phase'),
  ('CLS-6M', '6M', 'SEC-IP', 'TCH-008', 'Room 25', 'Intersen Phase'),
  ('CLS-6B', '6B', 'SEC-IP', 'TCH-008', 'Room 27', 'Intersen Phase'),
  ('CLS-7T', '7T', 'SEC-IP', 'TCH-009', 'Room 15', 'Intersen Phase'),
  ('CLS-7N', '7N', 'SEC-IP', 'TCH-009', 'Room 19', 'Intersen Phase'),
  ('CLS-7S', '7S', 'SEC-IP', 'TCH-009', 'Room 20', 'Intersen Phase'),
  ('CLS-7A', '7A', 'SEC-IP', 'TCH-009', 'Room 21', 'Intersen Phase'),
  ('CLS-7M', '7M', 'SEC-IP', 'TCH-009', 'Room 22', 'Intersen Phase');

INSERT INTO routines (id, class_id, day, time_slot, subject_id, student_id) VALUES
  ('RT-001', 'CLS-RA', 'Monday', '07:30 AM', 'SUB-FOUNDATION', 'RPS-008'),
  ('RT-002', 'CLS-3N', 'Monday', '08:30 AM', 'SUB-FAL', 'RPS-006'),
  ('RT-003', 'CLS-4M', 'Tuesday', '09:30 AM', 'SUB-CODING', 'RPS-005'),
  ('RT-004', 'CLS-7T', 'Wednesday', '10:30 AM', 'SUB-LEADERSHIP', 'RPS-001'),
  ('RT-005', 'CLS-7N', 'Thursday', '11:30 AM', 'SUB-SPORT', 'RPS-002');

INSERT INTO invoices (id, student_id, description, amount, status, date) VALUES
  ('1', 'RPS-001', 'School Fees', 14500, 'Paid', '14 Jan 2026'),
  ('2', 'RPS-002', 'School Fees', 14500, 'Paid', '14 Jan 2026'),
  ('3', 'RPS-003', 'School Fees', 7250, 'Pending', '8 Apr 2026'),
  ('4', 'RPS-004', 'School Fees', 7250, 'Pending', '8 Apr 2026'),
  ('5', 'RPS-006', 'School Fees', 14500, 'Overdue', '14 Jan 2026');
