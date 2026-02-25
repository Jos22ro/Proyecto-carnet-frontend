import { FileText, PawPrint, Briefcase, Clock, CheckCircle, Loader2 } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import CategoryCard from '@/components/ui/CategoryCard';
import { useEmprendedores, useEmprendedorStats, useMascotas, useMascotaStats } from '../hooks/useEntities.js';
import { useSolicitudes } from '../hooks/useSolicitudes.js';

const Dashboard = () => {
  const { data: allSolicitudes, isLoading: isLoadingAll } = useSolicitudes();
  const { data: emprendedoresStats, isLoading: isLoadingEmprendedores } = useEmprendedorStats();
  const { data: mascotasStats, isLoading: isLoadingMascotas } = useMascotaStats();

  // Default stats while loading - transform to match CategoryStats interface
  const transformStats = (stats: any) => ({
    total: stats?.total || 0,
    pendiente: stats?.pendientes || stats?.pendiente || 0,
    aprobado: stats?.aprobados || stats?.aprobado || 0,
    rechazado: stats?.rechazados || stats?.rechazado || 0,
  });

  const defaultStats = { total: 0, pendiente: 0, aprobado: 0, rechazado: 0 };

  const totalStats = allSolicitudes?.data ? {
    total: allSolicitudes.pagination.total,
    pendiente: allSolicitudes.data.filter(r => r.estado === 'pendiente').length,
    aprobado: allSolicitudes.data.filter(r => r.estado === 'aprobado').length,
    rechazado: allSolicitudes.data.filter(r => r.estado === 'rechazado').length,
  } : defaultStats;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumen general del sistema de carnets comunitarios</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Solicitudes"
          value={totalStats.total}
          icon={FileText}
          variant="primary"
        />
        <StatCard
          title="Pendientes"
          value={totalStats.pendiente}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Aprobados"
          value={totalStats.aprobado}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Rechazados"
          value={totalStats.rechazado}
          icon={FileText}
          variant="default"
        />
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Categorías de Carnets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CategoryCard
            title="Mascotas"
            description="Gestión de carnets para mascotas de la comunidad"
            icon={PawPrint}
            emoji="🐾"
            stats={transformStats(mascotasStats?.data)}
            href="/mascotas"
            variant="pets"
          />
          <CategoryCard
            title="Emprendedores"
            description="Carnets para negocios y emprendimientos locales"
            icon={Briefcase}
            emoji="💼"
            stats={transformStats(emprendedoresStats?.data)}
            href="/emprendedores"
            variant="business"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Actividad Reciente</h2>
        {isLoadingAll ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {allSolicitudes?.data && allSolicitudes.data.length > 0 ? (
              allSolicitudes.data
                .slice(0, 5)
                .map((record) => (
                  <div key={record.id_solicitud} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {record.tipo_solicitud === 'mascota' && '🐾'}
                        {record.tipo_solicitud === 'emprendedor' && '💼'}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          Solicitud #{record.id_solicitud}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {record.email_contacto}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`status-badge ${
                        record.estado === 'pendiente' ? 'status-pending' :
                        record.estado === 'aprobado' ? 'status-approved' : 'status-rejected'
                      }`}>
                        {record.estado.charAt(0).toUpperCase() + record.estado.slice(1)}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(record.fecha_creacion).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No hay solicitudes recientes
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
