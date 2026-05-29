import { ReactNode } from 'react';

interface BadgeProps { children: ReactNode; variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'; size?: 'sm' | 'md'; }

const v = {
  default: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
  primary: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const s = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-xs' };

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return <span className={`inline-flex items-center font-medium rounded-full ${v[variant]} ${s[size]}`}>{children}</span>;
}
