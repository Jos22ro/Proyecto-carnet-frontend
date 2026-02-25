import { useEffect, useMemo, useState } from "react";
import type { AxiosInstance } from "axios";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type MonthItem = { year: number; month: number };

type Props = {
  api: AxiosInstance;
  tipo: "mascota" | "emprendedor";
  mesesPath: string;
  excelPath: string; // ejemplo: "/api/reportes/emprendedores/excel"
  className?: string;
};

function formatMonthLabel(year: number, month: number) {
  const date = new Date(year, month - 1, 1);
  const label = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function parseFileNameFromContentDisposition(cd?: string) {
  if (!cd) return null;
  const match = cd.match(/filename="([^"]+)"/i);
  return match?.[1] ?? null;
}

export default function ReporteExcelFilter({ api, tipo, excelPath, className, mesesPath }: Props) {
  const { toast } = useToast();

  const [months, setMonths] = useState<MonthItem[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loadingMonths, setLoadingMonths] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadMonths = async () => {
      try {
        setLoadingMonths(true);
        const res = await api.get(mesesPath, { params: { tipo } });
        const raw: MonthItem[] = Array.isArray(res.data) ? res.data : [];

        const sorted = [...raw].sort((a, b) => (a.year !== b.year ? b.year - a.year : b.month - a.month));
        setMonths(sorted);

        if (sorted.length > 0) {
          const first = sorted[0];
          setSelected(`${first.year}-${String(first.month).padStart(2, "0")}`);
        } else {
          setSelected("");
        }
      } catch (error: any) {
        console.error(error);
        toast({
          title: "❌ Error cargando meses",
          description: error?.response?.data?.error ?? "No se pudieron cargar los meses disponibles.",
          variant: "destructive",
        });
      } finally {
        setLoadingMonths(false);
      }
    };

    loadMonths();
  }, [api, tipo, toast]);

  const options = useMemo(() => {
    return months.map((m) => ({
      value: `${m.year}-${String(m.month).padStart(2, "0")}`,
      label: formatMonthLabel(m.year, m.month),
      year: m.year,
      month: m.month,
    }));
  }, [months]);

  const selectedObj = useMemo(() => options.find((o) => o.value === selected) ?? null, [options, selected]);

  const downloadExcel = async () => {
    if (!selectedObj) return;

    try {
      setDownloading(true);

      const resp = await api.get(excelPath, {
        params: { year: selectedObj.year, month: selectedObj.month },
        responseType: "blob",
      });

      const fallback = `reporte_${tipo}_${selectedObj.year}-${String(selectedObj.month).padStart(2, "0")}.xlsx`;
      const fileName = parseFileNameFromContentDisposition(resp.headers?.["content-disposition"]) ?? fallback;

      const blob = new Blob([resp.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "✅ Descarga iniciada",
        description: `${formatMonthLabel(selectedObj.year, selectedObj.month)}`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "❌ Error descargando Excel",
        description: error?.response?.data?.error ?? "No se pudo descargar el Excel.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <select
        className="h-10 rounded-md border bg-background px-3 text-sm"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        disabled={loadingMonths || options.length === 0}
      >
        {options.length === 0 ? (
          <option value="">{loadingMonths ? "Cargando..." : "Sin meses disponibles"}</option>
        ) : (
          options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))
        )}
      </select>

      <Button onClick={downloadExcel} className="gap-2" disabled={!selectedObj || downloading || loadingMonths}>
        <Download className="h-4 w-4" />
        {downloading ? "Descargando..." : "Descargar Excel"}
      </Button>
    </div>
  );
}
