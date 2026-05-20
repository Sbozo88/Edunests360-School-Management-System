import type { Context } from "@netlify/functions";
import { getDb } from "./db/connection.mts";

export default async (req: Request, context: Context) => {
    const db = getDb();
    const { method } = req;
    const url = new URL(req.url);

    try {
        if (method === 'GET') {
            // Extract pagination, search and filtering parameters
            const page = parseInt(url.searchParams.get("page") || "1", 10);
            const limit = parseInt(url.searchParams.get("limit") || "20", 10);
            const search = url.searchParams.get("search") || null;
            const statusFilter = url.searchParams.get("status") || null; // e.g. "Paid", "Pending", "Overdue"

            const offset = (page - 1) * limit;
            const searchPattern = search ? `%${search}%` : null;

            // Get total count matching active filters
            const countResult = await db`
                SELECT COUNT(*)::integer AS total 
                FROM invoices
                LEFT JOIN students ON students.id = invoices.student_id
                WHERE 
                    (${searchPattern}::text IS NULL OR students.name ILIKE ${searchPattern} OR invoices.student_id ILIKE ${searchPattern} OR invoices.id ILIKE ${searchPattern})
                    AND (${statusFilter}::text IS NULL OR invoices.status = ${statusFilter})
            `;
            const total = countResult[0]?.total || 0;
            const totalPages = Math.ceil(total / limit);

            // Fetch paginated results
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
                WHERE 
                    (${searchPattern}::text IS NULL OR students.name ILIKE ${searchPattern} OR invoices.student_id ILIKE ${searchPattern} OR invoices.id ILIKE ${searchPattern})
                    AND (${statusFilter}::text IS NULL OR invoices.status = ${statusFilter})
                ORDER BY invoices.created_at DESC, invoices.id ASC
                LIMIT ${limit} OFFSET ${offset}
            `;

            return new Response(JSON.stringify({
                invoices,
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
        return new Response("Method Not Allowed", { status: 405 });
    } catch (error: any) {
        console.error("API Error (invoices):", error);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config = {
    path: "/api/invoices"
};
