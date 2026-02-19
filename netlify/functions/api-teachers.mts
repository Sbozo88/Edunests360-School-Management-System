import type { Context } from "@netlify/functions";
import { getDb } from "./db/connection.mts";

export default async (req: Request, context: Context) => {
    const db = getDb();
    const { method } = req;

    try {
        if (method === 'GET') {
            const teachers = await db`SELECT * FROM teachers ORDER BY name ASC`;
            return new Response(JSON.stringify(teachers), {
                headers: { "Content-Type": "application/json" }
            });
        }
        return new Response("Method Not Allowed", { status: 405 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const config = {
    path: "/api/teachers"
};
