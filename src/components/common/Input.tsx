import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-tertiary)]">{typeof icon === 'string' ? <span className="text-sm">{icon}</span> : icon}</div>}
      <input ref={ref} className={`w-full px-3 py-2.5 bg-[var(--bg-primary)] border ${error ? 'border-[var(--accent-danger)]' : 'border-[var(--border-color)]'} rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all duration-200 ${icon ? 'pl-10' : ''} ${className}`} {...props} />
    </div>
    {error && <p className="mt-1 text-sm text-[var(--accent-danger)]">{error}</p>}
  </div>
));
Input.displayName = 'Input';
