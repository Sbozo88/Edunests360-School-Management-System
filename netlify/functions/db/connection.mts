import { neon } from '@netlify/neon';

export const getDb = () => {
    const sql = neon(process.env.DATABASE_URL!);
    return sql;
};
