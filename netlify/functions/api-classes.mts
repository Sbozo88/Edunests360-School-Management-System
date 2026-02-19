import type { Context } from "@netlify/functions";
import { getDb } from "./db/connection.mts";

export default async (req: Request, context: Context) => {
    const db = getDb();
    const { method } = req;

    try {
        if (method === 'GET') {
            const classes = await db`SELECT * FROM classes ORDER BY name ASC`;
            return new Response(JSON.stringify(classes), {
                headers: { "Content-Type": "application/json" }
            });
        }

        if (method === 'POST') {
            const data = await req.json();
            const { id, name, section_id, teacher_id, room_id, shift } = data;
            await db`
        INSERT INTO classes (id, name, section_id, teacher_id, room_id, shift)
        VALUES (${id}, ${name}, ${section_id}, ${teacher_id}, ${room_id}, ${shift})
      `;
            return new Response(JSON.stringify({ success: true }), { status: 201 });
        }

        return new Response("Method Not Allowed", { status: 405 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const config = {
    path: "/api/classes"
};
