import type { Context } from "@netlify/functions";
import { getDb } from "./db/connection.mts";

export default async (req: Request, context: Context) => {
    const db = getDb();
    const { method } = req;
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const id = pathParts[pathParts.length - 1] === 'students' ? null : pathParts[pathParts.length - 1];

    try {
        if (method === 'GET') {
            if (id) {
                const student = await db`SELECT * FROM students WHERE id = ${id}`;
                return new Response(JSON.stringify(student[0] || {}), {
                    headers: { "Content-Type": "application/json" },
                    status: student[0] ? 200 : 404
                });
            }

            // Extract pagination, search and filtering parameters
            const page = parseInt(url.searchParams.get("page") || "1", 10);
            const limit = parseInt(url.searchParams.get("limit") || "20", 10);
            const search = url.searchParams.get("search") || null;
            const classFilter = url.searchParams.get("class") || null;
            const gradeFilter = url.searchParams.get("grade") || null; // e.g. "R", "1", "2"
            const statusFilter = url.searchParams.get("status") || null; // e.g. "Active", "Inactive"
            const feeFilter = url.searchParams.get("fee") || null; // e.g. "Paid", "Pending", "Overdue"

            const offset = (page - 1) * limit;

            // Search query pattern
            const searchPattern = search ? `%${search}%` : null;
            const gradePattern = gradeFilter ? `${gradeFilter}%` : null;

            // Get total count matching active filters
            const countResult = await db`
                SELECT COUNT(*)::integer AS total 
                FROM students
                WHERE 
                    (${searchPattern}::text IS NULL OR name ILIKE ${searchPattern} OR parent ILIKE ${searchPattern} OR id ILIKE ${searchPattern} OR email ILIKE ${searchPattern})
                    AND (${classFilter}::text IS NULL OR class = ${classFilter})
                    AND (${gradePattern}::text IS NULL OR class LIKE ${gradePattern})
                    AND (${statusFilter}::text IS NULL OR status = ${statusFilter})
                    AND (${feeFilter}::text IS NULL OR fee = ${feeFilter})
            `;
            const total = countResult[0]?.total || 0;
            const totalPages = Math.ceil(total / limit);

            // Fetch paginated results
            const students = await db`
                SELECT id, name, class, section, parent, email, status, attendance, avatar, fee
                FROM students
                WHERE 
                    (${searchPattern}::text IS NULL OR name ILIKE ${searchPattern} OR parent ILIKE ${searchPattern} OR id ILIKE ${searchPattern} OR email ILIKE ${searchPattern})
                    AND (${classFilter}::text IS NULL OR class = ${classFilter})
                    AND (${gradePattern}::text IS NULL OR class LIKE ${gradePattern})
                    AND (${statusFilter}::text IS NULL OR status = ${statusFilter})
                    AND (${feeFilter}::text IS NULL OR fee = ${feeFilter})
                ORDER BY created_at DESC, id ASC
                LIMIT ${limit} OFFSET ${offset}
            `;

            return new Response(JSON.stringify({
                students,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages
                }
            }), {
                headers: { "Content-Type": "application/json" }
            });
        }

        if (method === 'POST') {
            const data = await req.json();
            const { id, name, class: className, section, parent, email, status, attendance, avatar, fee } = data;
            await db`
                INSERT INTO students (id, name, class, section, parent, email, status, attendance, avatar, fee)
                VALUES (${id}, ${name}, ${className}, ${section}, ${parent}, ${email}, ${status || 'Active'}, ${attendance || 0}, ${avatar || null}, ${fee || 'Pending'})
            `;
            return new Response(JSON.stringify({ success: true }), { status: 201 });
        }

        if (method === 'PUT' && id) {
            const data = await req.json();
            const { name, class: className, section, parent, email, status, attendance, avatar, fee } = data;
            await db`
                UPDATE students
                SET name = ${name}, class = ${className}, section = ${section}, parent = ${parent}, 
                    email = ${email}, status = ${status}, attendance = ${attendance}, avatar = ${avatar}, fee = ${fee}
                WHERE id = ${id}
            `;
            return new Response(JSON.stringify({ success: true }));
        }

        if (method === 'DELETE' && id) {
            // Delete invoice first since it has student foreign relation concept (if any CASCADE isn't set)
            await db`DELETE FROM invoices WHERE student_id = ${id}`;
            await db`DELETE FROM students WHERE id = ${id}`;
            return new Response(JSON.stringify({ success: true }));
        }

        return new Response("Method Not Allowed", { status: 405 });
    } catch (error: any) {
        console.error("API Error (students):", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config = {
    path: "/api/students/:id?"
};
