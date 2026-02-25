import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import { SolicitudMascota } from '@/types';
import { Mail, Calendar, QrCode } from 'lucide-react';

interface DetailMascotaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SolicitudMascota | null;
}

const DetailMascotaDialog = ({ open, onOpenChange, item }: DetailMascotaDialogProps) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>🐾</span>
            Detalles del Carnet
          </DialogTitle>
          <DialogDescription>
            Información completa de la solicitud #{item.id_solicitud}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Estado actual</span>
            <StatusBadge status={item.estado} />
          </div>

          {/* Pet Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Datos de la Mascota</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Nombre</span>
                <p className="font-medium">{item.nombre_mascota}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Especie</span>
                <p className="font-medium">{item.especie}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Raza</span>
                <p className="font-medium">{item.raza || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Tutor</span>
                <p className="font-medium">{item.nombre_tutor}</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Contacto</h4>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{item.email_contacto}</span>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Fechas</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Creación: </span>
                  <span>{new Date(item.fecha_creacion).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
              {item.fecha_aprobacion && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <div>
                    <span className="text-muted-foreground">Aprobación: </span>
                    <span>{new Date(item.fecha_aprobacion).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QR Hash */}
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm">
            <QrCode className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Código QR:</span>
            <code className="text-xs bg-background px-2 py-1 rounded">
              {item.codigo_qr_hash.substring(0, 16)}...
            </code>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailMascotaDialog;
