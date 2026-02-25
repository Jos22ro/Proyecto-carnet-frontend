import { SolicitudEstado } from '@/types';
import { cn } from '@/lib/utils';

interface FilterTabsProps {
  currentFilter: SolicitudEstado | 'todos';
  onFilterChange: (filter: SolicitudEstado | 'todos') => void;
  counts: {
    todos: number;
    pendiente: number;
    aprobado: number;
    rechazado: number;
  };
}

const filters: { value: SolicitudEstado | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'aprobado', label: 'Aprobados' },
  { value: 'rechazado', label: 'Rechazados' },
];

const FilterTabs = ({ currentFilter, onFilterChange, counts }: FilterTabsProps) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
      {filters.map((filter) => {
        const isActive = currentFilter === filter.value;
        const count = counts[filter.value];
        
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {filter.label}
            <span className={cn(
              'ml-2 text-xs px-1.5 py-0.5 rounded-full',
              isActive ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/20'
            )}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
