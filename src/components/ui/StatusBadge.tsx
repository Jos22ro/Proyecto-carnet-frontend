import { SolicitudEstado } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: SolicitudEstado;
  className?: string;
}

const statusConfig: Record<SolicitudEstado, { label: string; className: string }> = {
  pendiente: {
    label: 'Pendiente',
    className: 'status-pending',
  },
  aprobado: {
    label: 'Aprobado',
    className: 'status-approved',
  },
  rechazado: {
    label: 'Rechazado',
    className: 'status-rejected',
  },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
