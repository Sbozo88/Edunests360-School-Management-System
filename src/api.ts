// Edunests365 API Client

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(endpoint, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
}

// Students
export const getStudents = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    class?: string;
    grade?: string;
    status?: string;
    fee?: string;
}) => {
    const query = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.append(key, String(value));
            }
        });
    }
    const queryString = query.toString();
    return fetchAPI(queryString ? `/api/students?${queryString}` : '/api/students');
};

export const getStudent = (id: string) => fetchAPI(`/api/students/${id}`);
export const createStudent = (data: any) => fetchAPI('/api/students', { method: 'POST', body: JSON.stringify(data) });
export const updateStudent = (id: string, data: any) => fetchAPI(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteStudent = (id: string) => fetchAPI(`/api/students/${id}`, { method: 'DELETE' });

// Teachers
export const getTeachers = () => fetchAPI('/api/teachers');

// Classes
export const getClasses = () => fetchAPI('/api/classes');
export const createClass = (data: any) => fetchAPI('/api/classes', { method: 'POST', body: JSON.stringify(data) });

// Routines
export const getRoutines = (classId?: string) => {
    const url = classId ? `/api/routines?classId=${classId}` : '/api/routines';
    return fetchAPI(url);
};
export const saveRoutine = (data: any) => fetchAPI('/api/routines', { method: 'POST', body: JSON.stringify(data) });
export const deleteRoutine = (id: string) => fetchAPI(`/api/routines/${id}`, { method: 'DELETE' });

// Subjects
export const getSubjects = (classId?: string) => {
    const url = classId ? `/api/subjects?classId=${classId}` : '/api/subjects';
    return fetchAPI(url);
};
export const saveSubject = (data: any) => fetchAPI('/api/subjects', { method: 'POST', body: JSON.stringify(data) });
export const deleteSubject = (id: string) => fetchAPI(`/api/subjects/${id}`, { method: 'DELETE' });

// Invoices
export const getInvoices = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}) => {
    const query = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.append(key, String(value));
            }
        });
    }
    const queryString = query.toString();
    return fetchAPI(queryString ? `/api/invoices?${queryString}` : '/api/invoices');
};

// Dashboard
export const getDashboardStats = () => fetchAPI('/api/dashboard');

// DB Admin
export const seedDatabase = () => fetchAPI('/api/db-seed');

