import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SolicitudEmprendedor } from '@/types';

interface RegisterEmprendedorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: SolicitudEmprendedor) => void;
}

const RegisterEmprendedorDialog = ({ open, onOpenChange, onSubmit }: RegisterEmprendedorDialogProps) => {
  const [formData, setFormData] = useState({
    razon_social: '',
    nombre_comercial: '',
    registro_fiscal: '',
    rubro: '',
    documento_titular: '',
    tipo_persona: '' as 'natural' | 'juridica' | '',
    direccion_fisica: '',
    telefono_contacto: '',
    email_contacto: '',
    descripcion_actividad: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: SolicitudEmprendedor = {
      id_solicitud: Date.now(),
      tipo_solicitud: 'emprendedor',
      estado: 'pendiente',
      origen: 'manual',
      email_contacto: formData.email_contacto,
      codigo_qr_hash: Math.random().toString(36).substring(2, 34),
      fecha_creacion: new Date().toISOString(),
      razon_social: formData.razon_social,
      nombre_comercial: formData.nombre_comercial,
      registro_fiscal: formData.registro_fiscal || undefined,
      rubro: formData.rubro,
      documento_titular: formData.documento_titular,
      tipo_persona: formData.tipo_persona as 'natural' | 'juridica',
      direccion_fisica: formData.direccion_fisica,
      telefono_contacto: formData.telefono_contacto,
      descripcion_actividad: formData.descripcion_actividad,
    };

    onSubmit(newItem);
    onOpenChange(false);
    setFormData({
      razon_social: '',
      nombre_comercial: '',
      registro_fiscal: '',
      rubro: '',
      documento_titular: '',
      tipo_persona: '',
      direccion_fisica: '',
      telefono_contacto: '',
      email_contacto: '',
      descripcion_actividad: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>💼</span>
            Registrar Nuevo Emprendedor
          </DialogTitle>
          <DialogDescription>
            Complete los datos para registrar un nuevo emprendimiento o negocio.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="razon_social">Razón Social *</Label>
              <Input
                id="razon_social"
                value={formData.razon_social}
                onChange={(e) => setFormData(prev => ({ ...prev, razon_social: e.target.value }))}
                placeholder="Ej: Panadería El Sol"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre_comercial">Nombre Comercial</Label>
              <Input
                id="nombre_comercial"
                value={formData.nombre_comercial}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre_comercial: e.target.value }))}
                placeholder="Ej: El Sol"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registro_fiscal">RIF (Registro Fiscal)</Label>
              <Input
                id="registro_fiscal"
                value={formData.registro_fiscal}
                onChange={(e) => setFormData(prev => ({ ...prev, registro_fiscal: e.target.value }))}
                placeholder="Ej: J-12345678-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rubro">Rubro</Label>
              <Select
                value={formData.rubro}
                onValueChange={(value) => setFormData(prev => ({ ...prev, rubro: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alimentos">Alimentos</SelectItem>
                  <SelectItem value="Artesanías">Artesanías</SelectItem>
                  <SelectItem value="Servicios">Servicios</SelectItem>
                  <SelectItem value="Comercio">Comercio</SelectItem>
                  <SelectItem value="Tecnología">Tecnología</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documento_titular">Documento del Titular *</Label>
            <Input
              id="documento_titular"
              value={formData.documento_titular}
              onChange={(e) => setFormData(prev => ({ ...prev, documento_titular: e.target.value }))}
              placeholder="Ej: 12345678"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_persona">Tipo de Persona *</Label>
            <Select
              value={formData.tipo_persona}
              onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_persona: value as 'natural' | 'juridica' }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="natural">Natural</SelectItem>
                <SelectItem value="juridica">Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion_fisica">Dirección Física</Label>
            <Input
              id="direccion_fisica"
              value={formData.direccion_fisica}
              onChange={(e) => setFormData(prev => ({ ...prev, direccion_fisica: e.target.value }))}
              placeholder="Ej: Calle Principal #123"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono_contacto">Teléfono</Label>
              <Input
                id="telefono_contacto"
                value={formData.telefono_contacto}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono_contacto: e.target.value }))}
                placeholder="Ej: +58 412 1234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_contacto">Email *</Label>
              <Input
                id="email_contacto"
                type="email"
                value={formData.email_contacto}
                onChange={(e) => setFormData(prev => ({ ...prev, email_contacto: e.target.value }))}
                placeholder="Ej: negocio@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion_actividad">Descripción de Actividad</Label>
            <Textarea
              id="descripcion_actividad"
              value={formData.descripcion_actividad}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion_actividad: e.target.value }))}
              placeholder="Describa brevemente la actividad del negocio..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Registrar Emprendedor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterEmprendedorDialog;
