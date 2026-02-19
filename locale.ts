// ==========================================
// South African Locale Utilities
// ==========================================

export const TIMEZONE = 'Africa/Johannesburg';
export const CURRENCY = 'ZAR';
export const CURRENCY_SYMBOL = 'R';
export const LOCALE = 'en-ZA';

/**
 * Format a number as South African Rand (ZAR)
 * e.g. formatCurrency(1500) → "R 1 500.00"
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency: CURRENCY,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

/**
 * Format a number as short ZAR (no decimals for stat cards)
 * e.g. formatCurrencyShort(15000) → "R15,000"
 */
export const formatCurrencyShort = (amount: number): string => {
    return `R${amount.toLocaleString(LOCALE)}`;
};

/**
 * Get current time in SAST (Africa/Johannesburg) 
 */
export const getSASTDate = (): Date => {
    const now = new Date();
    return new Date(now.toLocaleString('en-US', { timeZone: TIMEZONE }));
};

/**
 * Get time-of-day greeting based on SAST
 */
export const getGreeting = (): string => {
    const hour = getSASTDate().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
};

/**
 * Format a date string to SA locale format
 * e.g. "2024-10-24" → "24 Oct 2024"
 */
export const formatDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(LOCALE, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: TIMEZONE,
    });
};

/**
 * Format a date with time in SAST
 * e.g. "24 Oct 2024, 14:30"
 */
export const formatDateTime = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(LOCALE, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: TIMEZONE,
    });
};

/**
 * Get current time formatted in SAST
 */
export const getCurrentTimeSAST = (): string => {
    return new Date().toLocaleTimeString(LOCALE, {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: TIMEZONE,
        hour12: false,
    });
};
