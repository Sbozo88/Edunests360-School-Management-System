import { getDatabase, MissingDatabaseConnectionError } from '@netlify/database';

export const getDb = () => {
    try {
        return getDatabase().sql;
    } catch (error) {
        if (error instanceof MissingDatabaseConnectionError) {
            throw new Error('Database connection is not configured. Enable Netlify Database for this project.');
        }
        throw error;
    }
};
