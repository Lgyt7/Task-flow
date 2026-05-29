import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login, register, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => { if (isAuthenticated) navigate('/board'); }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (isRegister) {
      if (!name.trim()) { setError('Please enter your name'); return; }
      if (!register(name, email)) { setError('Registration failed'); return; }
    } else {
      if (!login(email)) { setError('Invalid email. Try: alex@taskflow.dev, sarah@taskflow.dev'); return; }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-[var(--bg-secondary)]">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
        <div className="flex-1 text-center lg:text-left max-w-md animate-fadeIn">
          <div className="inline-flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">TaskFlow</h1>
              <p className="text-[var(--text-secondary)] text-sm">Kanban Project Management</p>
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
            Manage your{' '}
            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              tasks
            </span>{' '}
            with ease
          </h2>
          <p className="text-[var(--text-secondary)] text-base lg:text-lg mb-8 leading-relaxed">
            A modern Kanban board for organizing projects, tracking progress, and collaborating with your team.
          </p>

          <div className="flex justify-center lg:justify-start gap-3 mb-8">
            <button
              onClick={() => setTheme('light')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                theme === 'light'
                  ? 'bg-white text-[var(--accent-primary)] shadow-md ring-1 ring-[var(--accent-primary)]/20'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
                Light
              </span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-[#1a2440] text-[var(--accent-primary)] shadow-md ring-1 ring-[var(--accent-primary)]/20'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
                Dark
              </span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { email: 'alex@taskflow.dev', label: 'Admin Demo', sub: 'alex@taskflow.dev' },
              { email: 'sarah@taskflow.dev', label: 'Member Demo', sub: 'sarah@taskflow.dev' },
            ].map((demo) => (
              <div
                key={demo.email}
                onClick={() => setEmail(demo.email)}
                className="flex-1 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-primary)]/40 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <p className="font-semibold text-sm text-[var(--text-primary)]">{demo.label}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5 font-mono">{demo.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-[var(--bg-card)] rounded-2xl shadow-lg p-7 border border-[var(--border-color)] animate-slideIn"
        >
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{isRegister ? 'Create Account' : 'Welcome Back'}</h3>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            {isRegister ? 'Register to start managing your tasks' : 'Sign in to continue to TaskFlow'}
          </p>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50/80 dark:bg-red-900/15 text-[var(--accent-danger)] text-sm border border-red-200 dark:border-red-900/30">
              {error}
            </div>
          )}
          {isRegister && (
            <div className="mb-4">
              <Input label="Name" type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div className="mb-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-6">
            <Input label="Password" type="password" placeholder="Enter any password" />
          </div>
          <Button type="submit" variant="gradient" fullWidth size="lg">
            {isRegister ? 'Create Account' : 'Sign In'}
          </Button>
          <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] font-medium"
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
