import type { Context } from "@netlify/functions";
import { getDb } from "./db/connection.mts";
import { INITIAL_TEACHERS, INITIAL_CLASSES, INITIAL_STUDENTS } from "../../data.ts";

// Diverse South African first names and surnames representing a Quintile 5 ordinary school demographic in Johannesburg
const FIRST_NAMES = [
    "Sipho", "Thabo", "Lindiwe", "Naledi", "Zola", "Bongani", "Mandla", "Nomvula", "Zanele", "Sibusiso",
    "Lungile", "Themba", "Dumisani", "Nonhlanhla", "Nkosana", "Kagiso", "Karabo", "Tshepo", "Rethabile", "Mpho",
    "Kabelo", "Lerato", "Tumi", "Boipelo", "Neo", "Palesa", "Lehlohonolo", "Sello", "Katlego", "Thandi",
    "Liam", "Noah", "Ethan", "Oliver", "William", "James", "Lucas", "Benjamin", "Mason", "Jack",
    "Olivia", "Emma", "Ava", "Sophia", "Isabella", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn",
    "Aarav", "Vihaan", "Arjun", "Sai", "Aditya", "Rohan", "Dev", "Krishna", "Ishaan", "Ananya",
    "Diya", "Aanya", "Saanvi", "Pari", "Riya", "Ira", "Zara", "Kiran", "Priya", "Raj",
    "Johan", "Pieter", "Jaco", "Francois", "Wian", "Stefan", "Anrich", "Ruan", "Elize",
    "Annelize", "Lize", "Chandre", "Marnel", "Hannelie", "Liezel", "Sunette", "Alisha", "Denzil", "Keanu",
    "Brandon", "Kayla", "Ashleigh", "Megan", "Tamara", "Nicolette", "Tebogo", "Kabelo", "Simphiwe", "Ayanda"
];

const SURNAMES = [
    "Mokoena", "Dlamini", "Naidoo", "Patel", "Khumalo", "Ndlovu", "Zulu", "Botha", "Smit", "Govender",
    "Pillay", "Nkosi", "Mthembu", "Sithole", "Zwane", "Mofokeng", "Mabaso", "Modise", "Sibanda", "Tshabalala",
    "Gumede", "Cele", "Singh", "Moodley", "Chetty", "Reddy", "Jacobs", "van Wyk", "Williams", "Pretorius",
    "Muller", "Nel", "du Plessis", "Steyn", "Coetzee", "Jansen", "Kruger", "Bothma", "Louw", "van der Merwe"
];

// CAPS curriculum subjects generator based on school grade
function getCAPSSubjects(className: string): { name: string; teacherId: string }[] {
    const isGradeR = className.startsWith('R');
    
    if (isGradeR) {
        return [
            { name: 'English Home Language', teacherId: 'TCH-004' },
            { name: 'Mathematics', teacherId: 'TCH-004' },
            { name: 'Life Skills', teacherId: 'TCH-004' }
        ];
    }
    
    const grade = parseInt(className.charAt(0), 10);
    
    if (grade >= 1 && grade <= 3) {
        const classTeacherMap: Record<number, string> = { 1: 'TCH-004', 2: 'TCH-005', 3: 'TCH-006' };
        const mainTeacher = classTeacherMap[grade] || 'TCH-004';
        
        return [
            { name: 'English Home Language', teacherId: mainTeacher },
            { name: 'isiZulu First Additional Language', teacherId: 'TCH-013' },
            { name: 'Mathematics', teacherId: mainTeacher },
            { name: 'Life Skills', teacherId: mainTeacher },
            { name: 'Coding and Robotics', teacherId: 'TCH-012' }
        ];
    }
    
    if (grade >= 4 && grade <= 6) {
        const classTeacherMap: Record<number, string> = { 4: 'TCH-007', 5: 'TCH-008', 6: 'TCH-008' };
        const mainTeacher = classTeacherMap[grade] || 'TCH-007';
        
        return [
            { name: 'English Home Language', teacherId: mainTeacher },
            { name: 'Afrikaans First Additional Language', teacherId: mainTeacher },
            { name: 'Mathematics', teacherId: mainTeacher },
            { name: 'Natural Sciences and Technology', teacherId: 'TCH-012' },
            { name: 'Social Sciences', teacherId: mainTeacher },
            { name: 'Life Skills', teacherId: mainTeacher }
        ];
    }
    
    if (grade === 7) {
        return [
            { name: 'English Home Language', teacherId: 'TCH-009' },
            { name: 'Afrikaans First Additional Language', teacherId: 'TCH-009' },
            { name: 'Mathematics', teacherId: 'TCH-009' },
            { name: 'Natural Sciences', teacherId: 'TCH-009' },
            { name: 'Social Sciences', teacherId: 'TCH-009' },
            { name: 'Technology', teacherId: 'TCH-012' },
            { name: 'Economic and Management Sciences (EMS)', teacherId: 'TCH-009' },
            { name: 'Creative Arts', teacherId: 'TCH-015' },
            { name: 'Life Orientation (LO)', teacherId: 'TCH-009' },
            { name: 'Physical Education', teacherId: 'TCH-014' }
        ];
    }
    
    return [];
}

export default async (req: Request, context: Context) => {
    const db = getDb();

    try {
        console.log("Starting DB seed process...");

        // 0. Ensure tables exist
        await db`
          CREATE TABLE IF NOT EXISTS students (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            class TEXT NOT NULL,
            section TEXT NOT NULL,
            parent TEXT NOT NULL,
            email TEXT NOT NULL,
            status TEXT DEFAULT 'Active',
            attendance INTEGER DEFAULT 0,
            fee TEXT DEFAULT 'Pending',
            avatar TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;
        await db`
          CREATE TABLE IF NOT EXISTS teachers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            email TEXT NOT NULL,
            status TEXT DEFAULT 'Active',
            classes JSONB DEFAULT '[]',
            avatar TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;
        await db`
          CREATE TABLE IF NOT EXISTS classes (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            section_id TEXT,
            teacher_id TEXT,
            room_id TEXT,
            shift TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;
        await db`
          CREATE TABLE IF NOT EXISTS subjects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            class_id TEXT NOT NULL,
            teacher_id TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;
        await db`
          CREATE TABLE IF NOT EXISTS routines (
            id TEXT PRIMARY KEY,
            class_id TEXT,
            day TEXT NOT NULL,
            time_slot TEXT NOT NULL,
            subject_id TEXT,
            student_id TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;
        await db`
          CREATE TABLE IF NOT EXISTS invoices (
            id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL,
            description TEXT NOT NULL,
            amount NUMERIC(10, 2) NOT NULL,
            status TEXT NOT NULL,
            date TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;

        // 1. Clear existing database tables
        console.log("Truncating existing tables...");
        await db`TRUNCATE students, teachers, classes, subjects, routines, invoices CASCADE`;

        // 2. Seed Classes
        console.log("Seeding classes...");
        for (const cls of INITIAL_CLASSES) {
            await db`
                INSERT INTO classes (id, name, section_id, teacher_id, room_id, shift)
                VALUES (${cls.id}, ${cls.name}, ${cls.sectionId}, ${cls.teacherId}, ${cls.roomId}, ${cls.shift})
            `;
        }

        // 3. Seed Teachers
        console.log("Seeding teachers...");
        for (const t of INITIAL_TEACHERS) {
            await db`
                INSERT INTO teachers (id, name, subject, email, status, classes)
                VALUES (${t.id}, ${t.name}, ${t.subject}, ${t.email}, ${t.status}, ${JSON.stringify(t.classes)})
            `;
        }

        // 4. Seed subjects curriculum per class
        console.log("Seeding CAPS subject curriculum...");
        const subjectsToInsert: any[] = [];
        const generatedSubjectsByClass: Record<string, { id: string; name: string }[]> = {};
        
        let subjectIndexCount = 1;
        for (const cls of INITIAL_CLASSES) {
            const list = getCAPSSubjects(cls.name);
            generatedSubjectsByClass[cls.id] = [];
            
            for (const item of list) {
                const subId = `SUB-${String(subjectIndexCount++).padStart(4, '0')}`;
                subjectsToInsert.push({
                    id: subId,
                    name: item.name,
                    class_id: cls.id,
                    teacher_id: item.teacherId
                });
                generatedSubjectsByClass[cls.id].push({ id: subId, name: item.name });
            }
        }

        const batchSize = 100;
        console.log(`Inserting ${subjectsToInsert.length} curriculum subjects...`);
        for (let i = 0; i < subjectsToInsert.length; i += batchSize) {
            const batch = subjectsToInsert.slice(i, i + batchSize);
            await Promise.all(batch.map(s => db`
                INSERT INTO subjects (id, name, class_id, teacher_id)
                VALUES (${s.id}, ${s.name}, ${s.class_id}, ${s.teacher_id})
            `));
        }

        // 5. Generate Students and Invoices
        console.log("Generating 1,152 students and matching invoices...");
        
        // Group the 8 core students by their respective class so we can integrate them easily
        const coreStudentsByClass: Record<string, typeof INITIAL_STUDENTS> = {};
        for (const s of INITIAL_STUDENTS) {
            if (!coreStudentsByClass[s.class]) {
                coreStudentsByClass[s.class] = [];
            }
            coreStudentsByClass[s.class].push(s);
        }

        const studentsToInsert: any[] = [];
        const invoicesToInsert: any[] = [];

        let studentCount = 1;
        let invoiceCount = 1;

        // Loop over the 32 designated classes
        for (const cls of INITIAL_CLASSES) {
            const className = cls.name; // e.g., "7T", "RA", etc.
            const sectionLetter = className.length > 1 ? className.charAt(className.length - 1) : 'A';
            
            // Get core students for this class
            const coreList = coreStudentsByClass[className] || [];
            const coreCount = coreList.length;
            const targetTotalPerClass = 36;
            const generatedCount = targetTotalPerClass - coreCount;

            // 5a. Add Core Students
            for (const core of coreList) {
                studentsToInsert.push({
                    id: core.id,
                    name: core.name,
                    classId: cls.id,
                    class: className,
                    section: sectionLetter,
                    parent: core.parent,
                    email: core.email,
                    status: core.status || 'Active',
                    attendance: core.attendance || 95,
                    fee: core.fee || 'Pending',
                    avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150&h=150&fit=crop&crop=face`
                });

                // Standardized invoice for core student
                const feeStatus = core.fee || 'Pending';
                let amount = 15500;
                let invoiceDate = "14 Jan 2026";
                if (feeStatus === 'Pending') {
                    amount = 7750; // Half paid
                    invoiceDate = "08 Apr 2026";
                }
                
                invoicesToInsert.push({
                    id: `INV-${String(invoiceCount++).padStart(4, '0')}`,
                    student_id: core.id,
                    description: 'School Fees',
                    amount: amount,
                    status: feeStatus,
                    date: invoiceDate
                });
            }

            // 5b. Generate other students for this class to make it exactly 36 students
            for (let i = 0; i < generatedCount; i++) {
                const idNum = String(studentCount++).padStart(4, '0');
                const studentId = `RPS-${idNum}`;
                
                // Pick a realistic name combination
                const fn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
                const ln = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
                const fullName = `${fn} ${ln}`;
                
                const parentFn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
                const parentName = `${parentFn} ${ln}`;
                
                const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@rempark.co.za`;
                const attendance = Math.floor(Math.random() * 15) + 85; // 85% to 99%
                
                // Active/Inactive distribution: 98% Active
                const status = Math.random() < 0.98 ? 'Active' : 'Inactive';
                
                // Fee Status: 70% Paid, 20% Pending, 10% Overdue
                const feeRand = Math.random();
                let feeStatus = 'Paid';
                let amount = 15500;
                let invoiceDate = '14 Jan 2026';
                
                if (feeRand >= 0.70 && feeRand < 0.90) {
                    feeStatus = 'Pending';
                    amount = 7750; // half paid
                    invoiceDate = '08 Apr 2026';
                } else if (feeRand >= 0.90) {
                    feeStatus = 'Overdue';
                    amount = 15500;
                    invoiceDate = '14 Jan 2026';
                }

                studentsToInsert.push({
                    id: studentId,
                    name: fullName,
                    classId: cls.id,
                    class: className,
                    section: sectionLetter,
                    parent: parentName,
                    email: email,
                    status: status,
                    attendance: attendance,
                    fee: feeStatus,
                    avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150&h=150&fit=crop&crop=face`
                });

                invoicesToInsert.push({
                    id: `INV-${String(invoiceCount++).padStart(4, '0')}`,
                    student_id: studentId,
                    description: 'School Fees',
                    amount: amount,
                    status: feeStatus,
                    date: invoiceDate
                });
            }
        }

        // 5c. Batch Insert Students
        console.log(`Inserting ${studentsToInsert.length} students into Database...`);
        for (let i = 0; i < studentsToInsert.length; i += batchSize) {
            const batch = studentsToInsert.slice(i, i + batchSize);
            await Promise.all(batch.map(s => db`
                INSERT INTO students (id, name, class, section, parent, email, status, attendance, fee, avatar)
                VALUES (${s.id}, ${s.name}, ${s.class}, ${s.section}, ${s.parent}, ${s.email}, ${s.status}, ${s.attendance}, ${s.fee}, ${s.avatar})
            `));
        }

        // 5d. Batch Insert Invoices
        console.log(`Inserting ${invoicesToInsert.length} invoices into Database...`);
        for (let i = 0; i < invoicesToInsert.length; i += batchSize) {
            const batch = invoicesToInsert.slice(i, i + batchSize);
            await Promise.all(batch.map(inv => db`
                INSERT INTO invoices (id, student_id, description, amount, status, date)
                VALUES (${inv.id}, ${inv.student_id}, ${inv.description}, ${inv.amount}, ${inv.status}, ${inv.date})
            `));
        }

        // 6. Seed Routines (Demo Weekly Timetables Monday to Friday)
        console.log("Seeding procedural routines (timetables)...");
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const periods = ['08:00 AM', '08:45 AM', '09:30 AM', '10:45 AM', '11:30 AM', '12:15 PM', '01:00 PM'];
        let routineCount = 1;
        const routinesToInsert: any[] = [];
        
        for (const cls of INITIAL_CLASSES) {
            const classSubjects = generatedSubjectsByClass[cls.id] || [];
            if (classSubjects.length === 0) continue;
            
            let subjectIndex = 0;
            
            for (const day of days) {
                for (const period of periods) {
                    const subject = classSubjects[subjectIndex % classSubjects.length];
                    subjectIndex++;
                    
                    routinesToInsert.push({
                        id: `RT-${String(routineCount++).padStart(4, '0')}`,
                        classId: cls.id,
                        day: day,
                        timeSlot: period,
                        subjectId: subject.id,
                        studentId: null // Class-wide timetable routine
                    });
                }
            }
        }

        // Link sample generated/core learners to class-specific support routines.
        for (const cls of INITIAL_CLASSES) {
            const classSubjects = generatedSubjectsByClass[cls.id] || [];
            if (classSubjects.length === 0) continue;

            const linkedStudents = studentsToInsert
                .filter(s => s.classId === cls.id)
                .slice(0, 2);

            linkedStudents.forEach((student, index) => {
                const subject = classSubjects[index % classSubjects.length];
                routinesToInsert.push({
                    id: `RT-${String(routineCount++).padStart(4, '0')}`,
                    classId: cls.id,
                    day: 'Wednesday',
                    timeSlot: index === 0 ? '08:45 AM' : '12:15 PM',
                    subjectId: subject.id,
                    studentId: student.id
                });
            });
        }

        console.log(`Inserting ${routinesToInsert.length} routines into Database...`);
        for (let i = 0; i < routinesToInsert.length; i += batchSize) {
            const batch = routinesToInsert.slice(i, i + batchSize);
            await Promise.all(batch.map(rt => db`
                INSERT INTO routines (id, class_id, day, time_slot, subject_id, student_id)
                VALUES (${rt.id}, ${rt.classId}, ${rt.day}, ${rt.timeSlot}, ${rt.subjectId}, ${rt.studentId})
            `));
        }

        console.log("Database seeding completed successfully!");
        return new Response(JSON.stringify({
            success: true,
            message: `Database successfully seeded with ${studentsToInsert.length} learners, ${subjectsToInsert.length} CAPS subjects, and ${routinesToInsert.length} weekday routines.`,
            stats: {
                classes: INITIAL_CLASSES.length,
                teachers: INITIAL_TEACHERS.length,
                students: studentsToInsert.length,
                subjects: subjectsToInsert.length,
                invoices: invoicesToInsert.length,
                routines: routinesToInsert.length
            }
        }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error: any) {
        console.error("Seed Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config = {
    path: "/api/db-seed"
};
