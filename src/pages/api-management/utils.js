import { FEATURE_OPTIONS } from './constants';

export const decodeJwtPayload = (token) => {
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
        const decoded = atob(padded);
        const json = decodeURIComponent(
            decoded
                .split('')
                .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
                .join('')
        );

        return JSON.parse(json);
    } catch (error) {
        return null;
    }
};

export const getRoleFromPayload = (payload) => {
    if (!payload) return null;
    if (typeof payload.role === 'string') return payload.role;
    if (typeof payload?.user?.role === 'string') return payload.user.role;
    if (Array.isArray(payload.roles)) return payload.roles[0] || null;

    if (Array.isArray(payload.authorities)) {
        const adminAuthority = payload.authorities.find((item) => item === 'ADMIN' || item === 'ROLE_ADMIN');
        if (adminAuthority) return 'ADMIN';
    }

    return null;
};

export const formatDateTime = (value) => {
    if (!value) return '-';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

export const isValidHttpUrl = (value) => {
    if (!value) return true;

    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (error) {
        return false;
    }
};

export const featureLabel = (feature) => FEATURE_OPTIONS.find((item) => item.value === feature)?.label || feature || '-';

export const statusBadgeClasses = (isActive) => (
    isActive
        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
);

export const fieldErrorMessage = (errors, key) => (errors?.[key] ? String(errors[key]) : '');
