import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Plus, Check, X, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import FilterTabs from "@/components/ui/FilterTabs";
import StatusBadge from "@/components/ui/StatusBadge";

import { SolicitudEstado, SolicitudMascota } from "@/types";
import { useToast } from "@/hooks/use-toast";

import RegisterMascotaDialog from "@/components/dialogs/RegisterMascotaDialog";
import DetailMascotaDialog from "@/components/dialogs/DetailMascotaDialog";
import ReporteExcelFilter from "@/components/ReporteExcelFilter";

// ✅ Axios instance con token automático (localStorage: auth_token)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const MascotasPage = () => {
  const [filter, setFilter] = useState<SolicitudEstado | "todos">("todos");
  const [data, setData] = useState<SolicitudMascota[]>([]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SolicitudMascota | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // ✅ Cargar desde BD
  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/api/mascotas");
        setData(res.data?.data ?? []);
      } catch (error: any) {
        console.error(error);
        toast({
          title: "❌ Error cargando mascotas",
          description:
            error?.response?.data?.error ??
            "No se pudo cargar la lista desde la base de datos.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMascotas();
  }, [toast]);

  const counts = useMemo(
    () => ({
      todos: data.length,
      pendiente: data.filter((r) => r.estado === "pendiente").length,
      aprobado: data.filter((r) => r.estado === "aprobado").length,
      rechazado: data.filter((r) => r.estado === "rechazado").length,
    }),
    [data]
  );

  const filteredData = useMemo(
    () => (filter === "todos" ? data : data.filter((item) => item.estado === filter)),
    [data, filter]
  );

  // ✅ Aprobar: cambia estado en BD
  const handleApprove = async (item: SolicitudMascota) => {
    try {
      await api.patch(`/api/mascotas/${item.id_solicitud}/estado`, { estado: "aprobado" });

      setData((prev) =>
        prev.map((r) =>
          r.id_solicitud === item.id_solicitud
            ? {
              ...r,
              estado: "aprobado" as SolicitudEstado,
              fecha_aprobacion: new Date().toISOString(),
            }
            : r
        )
      );

      toast({
        title: "✅ Aprobado",
        description: `Se aprobó ${item.nombre_mascota}.`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "❌ Error al aprobar",
        description: error?.response?.data?.error ?? "No se pudo aprobar la mascota.",
        variant: "destructive",
      });
    }
  };

  // ✅ Rechazar: cambia estado en BD
  const handleReject = async (item: SolicitudMascota) => {
    try {
      await api.patch(`/api/mascotas/${item.id_solicitud}/estado`, { estado: "rechazado" });

      setData((prev) =>
        prev.map((r) =>
          r.id_solicitud === item.id_solicitud
            ? { ...r, estado: "rechazado" as SolicitudEstado }
            : r
        )
      );

      toast({
        title: "Solicitud rechazada",
        description: `Se rechazó ${item.nombre_mascota}.`,
        variant: "destructive",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "❌ Error al rechazar",
        description: error?.response?.data?.error ?? "No se pudo rechazar.",
        variant: "destructive",
      });
    }
  };

  const columns = useMemo(
    () => [
      { key: "nombre_mascota", label: "Nombre Mascota" },
      { key: "especie", label: "Especie" },
      { key: "raza", label: "Raza" },
      { key: "nombre_tutor", label: "Tutor" },
      { key: "email_contacto", label: "Email" },
      {
        key: "estado",
        label: "Estado",
        render: (item: SolicitudMascota) => (
          <div className="flex items-center justify-between gap-3">
            <StatusBadge status={item.estado} />

            <div className="flex items-center gap-2">
              {/* Ver detalles */}
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item);
                }}
                title="Ver detalles"
              >
                <Eye className="h-4 w-4" />
              </Button>

              {/* Acciones solo si pendiente */}
              {item.estado === "pendiente" && (
                <>
                  <Button
                    size="sm"
                    className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(item);
                    }}
                    title="Aprobar"
                  >
                    <Check className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(item);
                    }}
                    title="Rechazar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🐾</span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Mascotas</h1>
            <p className="text-muted-foreground">Administra los carnets de mascotas</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setIsRegisterOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Mascota
          </Button>
          <ReporteExcelFilter
            api={api}
            tipo="mascota"
            excelPath="/api/mascotas/excel"
            mesesPath="/api/mascotas/meses"
          />
        </div>
      </div>

      {/* Filtros */}
      <FilterTabs currentFilter={filter} onFilterChange={setFilter} counts={counts} />

      {/* Tabla */}
      <DataTable
        data={filteredData}
        columns={columns}
        onView={(item) => setSelectedItem(item)}
        // ⚠️ Si tu DataTable genera botones extra por estas props, comenta estas dos:
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Dialog registrar */}
      <RegisterMascotaDialog
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        onSubmit={async (newItem) => {
          try {
            // Guardar en Backend
            const res = await api.post("/api/mascotas", newItem);
            const createdMascota = res.data.data; // La respuesta real con ID

            setData((prev) => [createdMascota, ...prev]);

            toast({
              title: "✅ Mascota registrada",
              description: `${createdMascota.nombre_mascota} ha sido registrada exitosamente.`,
            });
          } catch (error: any) {
            console.error(error);
            toast({
              title: "❌ Error al registrar",
              description: error?.response?.data?.error ?? "No se pudo registrar la mascota.",
              variant: "destructive",
            });
          }
        }}
      />

      {/* Modal detalles */}
      <DetailMascotaDialog
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        item={selectedItem}
      />

    </div>
  );
};

export default MascotasPage;
