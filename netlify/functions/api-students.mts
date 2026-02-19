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
            const students = await db`SELECT * FROM students ORDER BY created_at DESC`;
            return new Response(JSON.stringify(students), {
                headers: { "Content-Type": "application/json" }
            });
        }

        if (method === 'POST') {
            const data = await req.json();
            const { id, name, class: className, section, parent, email, status, attendance, avatar } = data;
            await db`
        INSERT INTO students (id, name, class, section, parent, email, status, attendance, avatar)
        VALUES (${id}, ${name}, ${className}, ${section}, ${parent}, ${email}, ${status}, ${attendance}, ${avatar})
      `;
            return new Response(JSON.stringify({ success: true }), { status: 201 });
        }

        if (method === 'PUT' && id) {
            const data = await req.json();
            const { name, class: className, section, parent, email, status, attendance, avatar } = data;
            await db`
        UPDATE students
        SET name = ${name}, class = ${className}, section = ${section}, parent = ${parent}, 
            email = ${email}, status = ${status}, attendance = ${attendance}, avatar = ${avatar}
        WHERE id = ${id}
      `;
            return new Response(JSON.stringify({ success: true }));
        }

        if (method === 'DELETE' && id) {
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
