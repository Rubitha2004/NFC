import { cn } from '@/lib/utils';
import type { Worker } from '../types/factory.types';

interface WorkerIndicatorProps {
  worker: Worker;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

// Deterministic color from worker id for consistent avatar bg
const AVATAR_COLORS = [
  'bg-emerald-600',
  'bg-cyan-600',
  'bg-violet-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-sky-600',
  'bg-indigo-600',
  'bg-teal-600',
];

function getAvatarColor(id: string): string {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const SIZE_MAP = {
  sm: { avatar: 'w-6 h-6 text-[9px]', name: 'text-[9px]' },
  md: { avatar: 'w-8 h-8 text-[11px]', name: 'text-[10px]' },
  lg: { avatar: 'w-10 h-10 text-xs', name: 'text-xs' },
};

export function WorkerIndicator({
  worker,
  size = 'sm',
  showName = true,
  className,
}: WorkerIndicatorProps) {
  const { avatar, name: nameClass } = SIZE_MAP[size];
  const avatarColor = getAvatarColor(worker.id);

  return (
    <div className={cn('flex flex-col items-center gap-0.5', className)}>
      {/* Avatar */}
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold text-white ring-1 ring-white/20 flex-shrink-0',
          avatar,
          worker.photo ? '' : avatarColor
        )}
      >
        {worker.photo ? (
          <img
            src={worker.photo}
            alt={worker.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          getInitials(worker.name)
        )}
      </div>

      {/* Name */}
      {showName && (
        <span
          className={cn(
            'text-muted-foreground leading-tight text-center max-w-[70px] truncate',
            nameClass
          )}
          title={worker.name}
        >
          {worker.name.split(' ')[0]}
        </span>
      )}
    </div>
  );
}
