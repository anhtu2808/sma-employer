export const CANDIDATE_LEVEL_BADGE_VARIANTS = {
    INTERN: {
        soft: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
        outlined: 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
    },
    FRESHER: {
        soft: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
        outlined: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
    },
    JUNIOR: {
        soft: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        outlined: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    MIDDLE: {
        soft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        outlined: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    },
    SENIOR: {
        soft: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
        outlined: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
    },
    LEAD: {
        soft: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        outlined: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    },
    MANAGER: {
        soft: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        outlined: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    },
};

const DEFAULT_BADGE_VARIANTS = {
    soft: 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300',
    outlined: 'border-gray-200 bg-gray-50 text-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
};

export const getCandidateLevelBadgeClasses = (level, variant = 'outlined') => (
    CANDIDATE_LEVEL_BADGE_VARIANTS[level]?.[variant]
    || DEFAULT_BADGE_VARIANTS[variant]
    || DEFAULT_BADGE_VARIANTS.outlined
);
