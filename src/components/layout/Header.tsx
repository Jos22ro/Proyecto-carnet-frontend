import logo from '@/assets/logo.png';
import { User, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Carnet Comunitario" className="h-10 w-10 rounded-lg" />
        <div>
          <h1 className="font-semibold text-foreground text-lg leading-tight">Carnet Comunitario</h1>
          <p className="text-xs text-muted-foreground">Sistema de Gestión Digital</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{user?.email || 'Usuario'}</span>
            <span className="text-xs text-muted-foreground">{user?.role || 'Admin'}</span>
          </div>
        </div>

        {/* ✅ NUEVO: Link a registrar usuario */}
        <Link
          to="/registrar-usuario"
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          title="Registrar nuevo admin"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Registrar usuario</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
