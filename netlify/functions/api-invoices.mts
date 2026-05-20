import type { Context } from "@netlify/functions";
import { getDb } from "./db/connection.mts";

export default async (req: Request, context: Context) => {
    const db = getDb();
    const { method } = req;

    try {
        if (method === 'GET') {
            const invoices = await db`
                SELECT
                    invoices.id,
                    invoices.id AS "invoiceNo",
                    invoices.student_id AS "studentId",
                    COALESCE(students.name, invoices.student_id, 'Unknown student') AS "studentName",
                    invoices.description AS type,
                    invoices.amount::float AS amount,
                    invoices.status,
                    invoices.date
                FROM invoices
                LEFT JOIN students ON students.id = invoices.student_id
                ORDER BY invoices.created_at DESC
            `;
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
