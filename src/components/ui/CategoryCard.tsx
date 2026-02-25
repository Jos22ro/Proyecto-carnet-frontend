import { useNavigate } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { CategoryStats } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  emoji: string;
  stats: CategoryStats;
  href: string;
  variant?: 'pets' | 'business';
}

const variantStyles = {
  pets: 'hover:border-category-pets/40 group-hover:bg-category-pets/10',
  business: 'hover:border-primary/40 group-hover:bg-primary/5',
};

const emojiStyles = {
  pets: 'bg-category-pets/10',
  business: 'bg-primary/10',
};

const CategoryCard = ({ 
  title, 
  description, 
  emoji, 
  stats, 
  href,
  variant = 'business'
}: CategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(href)}
      className={cn(
        'bg-card rounded-lg border p-6 cursor-pointer group card-hover',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('category-icon text-2xl', emojiStyles[variant])}>
          {emoji}
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span className="text-muted-foreground">{stats.aprobado} aprobados</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent"></span>
          <span className="text-muted-foreground">{stats.pendiente} pendientes</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
