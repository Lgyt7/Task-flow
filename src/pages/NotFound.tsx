import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-secondary)]">
      <div className="text-center">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">404</h1>
        <p className="text-xl text-[var(--text-secondary)] mb-6">Page not found</p>
        <Link to="/board">
          <Button variant="gradient">Go to Board</Button>
        </Link>
      </div>
    </div>
  );
}
