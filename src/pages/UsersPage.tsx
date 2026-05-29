import { useAuth } from '../contexts/AuthContext';
import { UserList } from '../components/users/UserList';
import { Button } from '../components/common/Button';

export function UsersPage() {
  const { isAdmin } = useAuth();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Users</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage team members and roles</p>
        </div>
        {!isAdmin && (
          <Button variant="secondary" size="sm" disabled icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          }>Add User</Button>
        )}
      </div>
      <UserList />
    </div>
  );
}
