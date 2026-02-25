import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, PawPrint, Briefcase, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/mascotas', label: 'Mascotas', icon: PawPrint, emoji: '🐾' },
  { path: '/emprendedores', label: 'Emprendedores', icon: Briefcase, emoji: '💼' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-[calc(100vh-64px)]">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <Icon className={cn(
                'w-5 h-5 transition-transform group-hover:scale-105',
                isActive && 'text-sidebar-accent-foreground'
              )} />
              <span className="font-medium">{item.label}</span>
              {item.emoji && (
                <span className="ml-auto text-base opacity-70">{item.emoji}</span>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <NavLink
          to="/configuracion"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configuración</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
