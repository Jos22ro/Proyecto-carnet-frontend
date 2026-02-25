import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import { SolicitudEmprendedor } from '@/types';
import { Mail, Calendar, QrCode, MapPin, Phone, Building } from 'lucide-react';

interface DetailEmprendedorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SolicitudEmprendedor | null;
}

const DetailEmprendedorDialog = ({ open, onOpenChange, item }: DetailEmprendedorDialogProps) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>💼</span>
            Detalles del Carnet de Emprendedor
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

          {/* Business Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Datos del Negocio</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Razón Social</span>
                <p className="font-medium">{item.razon_social}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Nombre Comercial</span>
                <p className="font-medium">{item.nombre_comercial || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Rubro</span>
                <p className="font-medium">{item.rubro || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Tipo</span>
                <p className="font-medium capitalize">{item.tipo_persona || '-'}</p>
              </div>
            </div>
          </div>

          {/* Holder Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Titular</h4>
            <div className="flex items-center gap-2 text-sm">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span>Documento: {item.documento_titular}</span>
            </div>
            {item.registro_fiscal && (
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span>RIF: {item.registro_fiscal}</span>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Contacto</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{item.email_contacto}</span>
              </div>
              {item.telefono_contacto && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{item.telefono_contacto}</span>
                </div>
              )}
              {item.direccion_fisica && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{item.direccion_fisica}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {item.descripcion_actividad && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Descripción de Actividad</h4>
              <p className="text-sm text-muted-foreground">{item.descripcion_actividad}</p>
            </div>
          )}

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

          {/* Actions */}
          {item.estado === 'aprobado' && (
            <Button className="w-full gap-2">
              <Mail className="w-4 h-4" />
              Reenviar Carnet por Correo
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailEmprendedorDialog;
