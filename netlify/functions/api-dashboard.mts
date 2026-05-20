import type { Context } from "@netlify/functions";
import { getDb } from "./db/connection.mts";

export default async (req: Request, context: Context) => {
    const db = getDb();
    const { method } = req;

    try {
        if (method === 'GET') {
            // 1. Get total students count
            const studentsCount = await db`SELECT COUNT(*)::integer AS total FROM students`;
            const totalStudents = studentsCount[0]?.total || 0;

            // 2. Get total teachers count
            const teachersCount = await db`SELECT COUNT(*)::integer AS total FROM teachers`;
            const totalTeachers = teachersCount[0]?.total || 0;

            // 3. Get total staff (hardcoded 15 to match static INITIAL_STAFF)
            const totalStaff = 15;

            // 4. Get total revenue (sum of all PAID invoices)
            const revenueSum = await db`SELECT SUM(amount)::float AS total FROM invoices WHERE status = 'Paid'`;
            const totalRevenue = revenueSum[0]?.total || 0;

            // 5. Get recent PAID fee collections
            const recentCollections = await db`
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
                WHERE invoices.status = 'Paid'
                ORDER BY invoices.created_at DESC, invoices.id DESC
                LIMIT 5
            `;

            // 6. Aggregate monthly financials from database invoices
            const allInvoices = await db`SELECT amount::float AS amount, status, date FROM invoices`;
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            const incomeByMonth = months.reduce((acc, m) => {
                acc[m] = 0;
                return acc;
            }, {} as Record<string, number>);
            const outstandingByMonth = months.reduce((acc, m) => {
                acc[m] = 0;
                return acc;
            }, {} as Record<string, number>);

            for (const inv of allInvoices) {
                const dateStr = inv.date || '';
                const match = months.find(m => dateStr.includes(m));
                if (match) {
                    if (inv.status === 'Paid') {
                        incomeByMonth[match] += inv.amount;
                    } else {
                        outstandingByMonth[match] += inv.amount;
                    }
                }
            }

            // Construct 2026 financial data points from real invoice collections and receivables.
            const financialData = months.slice(0, 7).map((month, index) => {
                return {
                    name: month,
                    income: Math.round(incomeByMonth[month] || 0),
                    expense: Math.round(outstandingByMonth[month] || 0),
                    students: totalStudents
                };
            });

            return new Response(JSON.stringify({
                totalStudents,
                totalTeachers,
                totalStaff,
                totalRevenue,
                recentCollections,
                financialData
            }), {
                headers: { "Content-Type": "application/json" }
            });
        }
        return new Response("Method Not Allowed", { status: 405 });
    } catch (error: any) {
        console.error("API Error (dashboard):", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config = {
    path: "/api/dashboard"
};
