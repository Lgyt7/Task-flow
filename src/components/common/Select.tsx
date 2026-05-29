import { SelectHTMLAttributes } from 'react';

interface SelectOption { value: string; label: string; }

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">{label}</label>}
      <select className={`w-full px-3 py-2.5 bg-[var(--bg-primary)] border ${error ? 'border-[var(--accent-danger)]' : 'border-[var(--border-color)]'} rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all duration-200 appearance-none cursor-pointer ${className}`} {...props}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <p className="mt-1 text-sm text-[var(--accent-danger)]">{error}</p>}
    </div>
  );
}
