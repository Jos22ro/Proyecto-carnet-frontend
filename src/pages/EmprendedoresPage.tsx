import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Plus, Check, X, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import FilterTabs from "@/components/ui/FilterTabs";
import StatusBadge from "@/components/ui/StatusBadge";

import { SolicitudEstado, SolicitudEmprendedor } from "@/types";
import { useToast } from "@/hooks/use-toast";

import RegisterEmprendedorDialog from "@/components/dialogs/RegisterEmprendedorDialog";
import DetailEmprendedorDialog from "@/components/dialogs/DetailEmprendedorDialog";
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

const EmprendedoresPage = () => {
  const [filter, setFilter] = useState<SolicitudEstado | "todos">("todos");
  const [data, setData] = useState<SolicitudEmprendedor[]>([]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SolicitudEmprendedor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // ✅ Cargar desde BD
  useEffect(() => {
    const fetchEmprendedores = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/api/emprendedores");
        setData(res.data?.data ?? []);
      } catch (error: any) {
        console.error(error);
        toast({
          title: "❌ Error cargando emprendedores",
          description:
            error?.response?.data?.error ??
            "No se pudo cargar la lista desde la base de datos.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmprendedores();
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

  // ✅ Aprobar: cambia estado en BD (NO crea registro nuevo)
  const handleApprove = async (item: SolicitudEmprendedor) => {
    try {
      await api.patch(`/api/emprendedores/${item.id_solicitud}/estado`, {
        estado: "aprobado",
      });

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
        description: `Se aprobó ${item.razon_social ?? "el emprendedor"}.`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "❌ Error al aprobar",
        description: error?.response?.data?.error ?? "No se pudo aprobar el emprendedor.",
        variant: "destructive",
      });
    }
  };

  // ✅ Rechazar: cambia estado en BD
  const handleReject = async (item: SolicitudEmprendedor) => {
    try {
      await api.patch(`/api/emprendedores/${item.id_solicitud}/estado`, {
        estado: "rechazado",
      });

      setData((prev) =>
        prev.map((r) =>
          r.id_solicitud === item.id_solicitud
            ? { ...r, estado: "rechazado" as SolicitudEstado }
            : r
        )
      );

      toast({
        title: "Solicitud rechazada",
        description: `Se rechazó ${item.razon_social ?? "el emprendedor"}.`,
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
      { key: "razon_social", label: "Razón Social" },
      { key: "nombre_comercial", label: "Nombre Comercial" },
      { key: "rubro", label: "Rubro" },
      { key: "telefono_contacto", label: "Teléfono" },
      {
        key: "estado",
        label: "Estado",
        render: (item: SolicitudEmprendedor) => (
          <div className="flex items-center justify-between gap-3">
            <StatusBadge status={item.estado} />

            <div className="flex items-center gap-2">
              {/* Ver detalles (siempre disponible) */}
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

              {/* Acciones solo si está pendiente */}
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
            <h1 className="text-2xl font-bold text-foreground">Gestión de Emprendedores</h1>
            <p className="text-muted-foreground">Administra los carnets de emprendedores</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setIsRegisterOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Emprendedor
          </Button>
          <ReporteExcelFilter
            api={api}
            tipo="emprendedor"
            excelPath="/api/emprendedores/excel"
            mesesPath="/api/emprendedores/meses"
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
        // ⚠️ Si tu DataTable genera botones por estas props, comenta estas dos líneas:
        onApprove={handleApprove}
        onReject={handleReject}

      />

      {/* Dialog registrar */}
      <RegisterEmprendedorDialog
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        onSubmit={async (newItem) => {
          try {
            // Guardar en Backend
            const res = await api.post("/api/emprendedores", newItem);
            const createdEmprendedor = res.data.data; // Respuesta real con ID

            setData((prev) => [createdEmprendedor, ...prev]);
            toast({
              title: "✅ Emprendedor registrado",
              description: `${createdEmprendedor.razon_social ?? "Nuevo emprendedor"} registrado exitosamente.`,
            });
          } catch (error: any) {
            console.error(error);
            toast({
              title: "❌ Error al registrar",
              description: error?.response?.data?.error ?? "No se pudo registrar el emprendedor.",
              variant: "destructive",
            });
          }
        }}
      />

      {/* Modal detalles */}
      <DetailEmprendedorDialog
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        item={selectedItem}
      />
    </div>
  );
};

export default EmprendedoresPage;
