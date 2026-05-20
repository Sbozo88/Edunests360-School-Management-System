import type { Context } from "@netlify/functions";
import { getDb } from "./db/connection.mts";

export default async (req: Request, context: Context) => {
    const db = getDb();
    const { method } = req;
    const url = new URL(req.url);
    const classId = url.searchParams.get("classId");

    try {
        if (method === 'GET') {
            const subjects = classId
                ? await db`
                    SELECT
                        subjects.id,
                        subjects.name,
                        subjects.class_id AS "classId",
                        subjects.teacher_id AS "teacherId",
                        teachers.name AS "teacherName"
                    FROM subjects
                    LEFT JOIN teachers ON teachers.id = subjects.teacher_id
                    WHERE subjects.class_id = ${classId}
                    ORDER BY subjects.name ASC
                `
                : await db`
                    SELECT
                        subjects.id,
                        subjects.name,
                        subjects.class_id AS "classId",
                        subjects.teacher_id AS "teacherId",
                        teachers.name AS "teacherName"
                    FROM subjects
                    LEFT JOIN teachers ON teachers.id = subjects.teacher_id
                    ORDER BY subjects.name ASC
                `;
            return new Response(JSON.stringify(subjects), {
                headers: { "Content-Type": "application/json" }
            });
        }

        if (method === 'POST') {
            const data = await req.json();
            const { id, name, classId: cId, teacherId: tId } = data;
            await db`
                INSERT INTO subjects (id, name, class_id, teacher_id)
                VALUES (${id}, ${name}, ${cId}, ${tId})
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    class_id = EXCLUDED.class_id,
                    teacher_id = EXCLUDED.teacher_id
            `;
            return new Response(JSON.stringify({ success: true }), { status: 201 });
        }

        if (method === 'DELETE' && url.pathname.includes('subjects/')) {
            const pathParts = url.pathname.split('/');
            const idToDelete = pathParts[pathParts.length - 1];
            
            // Delete associated routines first to prevent foreign key errors
            await db`DELETE FROM routines WHERE subject_id = ${idToDelete}`;
            await db`DELETE FROM subjects WHERE id = ${idToDelete}`;
            
            return new Response(JSON.stringify({ success: true }));
        }

        return new Response("Method Not Allowed", { status: 405 });
    } catch (error: any) {
        console.error("API Error (subjects):", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const config = {
    path: "/api/subjects/:id?"
};
