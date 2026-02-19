import type { Context } from "@netlify/functions";
import { getDb } from "./db/connection.mts";
import { INITIAL_STUDENTS, INITIAL_TEACHERS, INITIAL_INVOICES } from "../../data.ts";

export default async (req: Request, context: Context) => {
    const db = getDb();

    try {
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
            student_id TEXT,
            description TEXT NOT NULL,
            amount NUMERIC(10, 2) NOT NULL,
            status TEXT NOT NULL,
            date TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;

        // 1. Clear existing (optional, but good for clean seed)
        // await db`TRUNCATE students, teachers, invoices CASCADE`;

        // 2. Seed Students
        for (const s of INITIAL_STUDENTS) {
            const classParts = s.class.split('-');
            const className = classParts[0] || s.class;
            const section = classParts[1] || 'A';

            await db`
        INSERT INTO students (id, name, class, section, parent, email, status, attendance)
        VALUES (${s.id}, ${s.name}, ${className}, ${section}, ${s.parent}, ${s.email}, ${s.status}, ${s.attendance})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          class = EXCLUDED.class,
          section = EXCLUDED.section,
          parent = EXCLUDED.parent,
          email = EXCLUDED.email,
          status = EXCLUDED.status,
          attendance = EXCLUDED.attendance
      `;
        }

        // 3. Seed Teachers
        for (const t of INITIAL_TEACHERS) {
            await db`
        INSERT INTO teachers (id, name, subject, email, status, classes)
        VALUES (${t.id}, ${t.name}, ${t.subject}, ${t.email}, ${t.status}, ${JSON.stringify(t.classes)})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          subject = EXCLUDED.subject,
          email = EXCLUDED.email,
          status = EXCLUDED.status,
          classes = EXCLUDED.classes
      `;
        }

        // 4. Seed Invoices
        for (const inv of INITIAL_INVOICES) {
            await db`
        INSERT INTO invoices (id, student_id, description, amount, status, date)
        VALUES (${inv.id}, ${inv.studentId}, ${inv.type}, ${inv.amount}, ${inv.status}, ${inv.date})
        ON CONFLICT (id) DO UPDATE SET
          student_id = EXCLUDED.student_id,
          description = EXCLUDED.description,
          amount = EXCLUDED.amount,
          status = EXCLUDED.status,
          date = EXCLUDED.date
      `;
        }

        return new Response(JSON.stringify({ success: true, message: "Database seeded successfully" }), {
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
