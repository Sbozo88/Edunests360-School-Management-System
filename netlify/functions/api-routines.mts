import type { Context } from "@netlify/functions";
import { getDb } from "./db/connection.mts";

export default async (req: Request, context: Context) => {
    const db = getDb();
    const { method } = req;
    const url = new URL(req.url);
    const classId = url.searchParams.get("classId");

    try {
        if (method === 'GET') {
            const routines = classId
                ? await db`SELECT * FROM routines WHERE class_id = ${classId} ORDER BY time_slot ASC`
                : await db`SELECT * FROM routines ORDER BY time_slot ASC`;
            return new Response(JSON.stringify(routines), {
                headers: { "Content-Type": "application/json" }
            });
        }

        if (method === 'POST') {
            const data = await req.json();
            const { id, class_id, day, time_slot, subject_id, student_id } = data;
            await db`
        INSERT INTO routines (id, class_id, day, time_slot, subject_id, student_id)
        VALUES (${id}, ${class_id}, ${day}, ${time_slot}, ${subject_id}, ${student_id})
        ON CONFLICT (id) DO UPDATE SET
          class_id = EXCLUDED.class_id,
          day = EXCLUDED.day,
          time_slot = EXCLUDED.time_slot,
          subject_id = EXCLUDED.subject_id,
          student_id = EXCLUDED.student_id
      `;
            return new Response(JSON.stringify({ success: true }), { status: 201 });
        }

        if (method === 'DELETE' && url.pathname.includes('routines/')) {
            const pathParts = url.pathname.split('/');
            const idToDelete = pathParts[pathParts.length - 1];
            await db`DELETE FROM routines WHERE id = ${idToDelete}`;
            return new Response(JSON.stringify({ success: true }));
        }

        return new Response("Method Not Allowed", { status: 405 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const config = {
    path: "/api/routines/:id?"
};
