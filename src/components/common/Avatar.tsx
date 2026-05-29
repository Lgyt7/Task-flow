interface AvatarProps { name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; online?: boolean; }

const sizeStyles = { sm: 'w-6 h-6 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-10 h-10 text-base', xl: 'w-12 h-12 text-lg' };

const gradients = ['from-blue-500 to-purple-500', 'from-green-500 to-teal-500', 'from-orange-500 to-pink-500', 'from-indigo-500 to-blue-500', 'from-purple-500 to-pink-500', 'from-teal-500 to-cyan-500'];

function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
}

export function Avatar({ name, size = 'md', online }: AvatarProps) {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  return (
    <div className="relative inline-flex">
      <div className={`rounded-full bg-gradient-to-br ${getGradient(name)} flex items-center justify-center text-white font-semibold ${sizeStyles[size]}`}>
        {initials}
      </div>
      {online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--accent-success)] border-2 border-white rounded-full" />}
    </div>
  );
}
