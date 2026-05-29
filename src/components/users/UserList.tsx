import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { UserRole } from '../../types';
import { updateUserRole, deleteUser } from '../../services/authService';
import { formatDate } from '../../services/storage';

const roleColors: Record<UserRole, 'primary' | 'success' | 'warning'> = {
  admin: 'warning',
  member: 'primary',
  viewer: 'success',
};

export function UserList() {
  const { users, user, refreshUsers } = useAuth();

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateUserRole(userId, role);
    refreshUsers();
  };

  const handleDelete = (userId: string) => {
    if (confirm('Delete this user?')) {
      deleteUser(userId);
      refreshUsers();
    }
  };

  return (
    <div className="space-y-4">
      {users.map((u) => (
        <div key={u.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
          <Avatar name={u.name} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-[var(--text-primary)]">{u.name}</h4>
              <Badge variant={roleColors[u.role]} size="sm">{u.role}</Badge>
              {u.id === user?.id && <Badge variant="info" size="sm">You</Badge>}
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{u.email}</p>
            <p className="text-xs text-[var(--text-tertiary)]">Joined {formatDate(u.createdAt)}</p>
          </div>
          {user?.role === 'admin' && u.id !== user.id && (
            <div className="flex items-center gap-2 shrink-0">
              <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)} className="px-2 py-1.5 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]">
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
              <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>Remove</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
