import type { Context } from "@netlify/functions";
import { getDb } from "./db/connection.mts";

export default async (req: Request, context: Context) => {
    const db = getDb();
    const { method } = req;

    try {
        if (method === 'GET') {
            const invoices = await db`SELECT * FROM invoices ORDER BY date DESC`;
            return new Response(JSON.stringify(invoices), {
                headers: { "Content-Type": "application/json" }
            });
        }
        return new Response("Method Not Allowed", { status: 405 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const config = {
    path: "/api/invoices"
};
