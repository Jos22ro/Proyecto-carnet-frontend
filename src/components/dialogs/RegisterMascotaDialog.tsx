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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SolicitudMascota } from '@/types';

interface RegisterMascotaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: SolicitudMascota) => void;
}

const RegisterMascotaDialog = ({ open, onOpenChange, onSubmit }: RegisterMascotaDialogProps) => {
  const [formData, setFormData] = useState({
    nombre_mascota: '',
    especie: '',
    raza: '',
    edad_mascota: '', // string para manejar input; lo convertimos a number al enviar
    nombre_tutor: '',
    telefono_tutor: '',
    zona_residente: '',
    email_contacto: '', // (esto NO está en detalles_mascotas, pero sí en tu flujo de Solicitud)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const edadNum =
      formData.edad_mascota.trim() === '' ? undefined : Number(formData.edad_mascota);

    const newItem: SolicitudMascota = {
      tipo_solicitud: 'mascota',
      estado: 'pendiente',
      origen: 'manual',
      email_contacto: formData.email_contacto,
      codigo_qr_hash: Math.random().toString(36).substring(2, 34),
      fecha_creacion: new Date().toISOString(),

      // Campos equivalentes a detalles_mascotas (sin IDs)
      nombre_mascota: formData.nombre_mascota,
      especie: formData.especie,
      raza: formData.raza,
      nombre_tutor: formData.nombre_tutor,

      // Nuevos campos de la tabla
      edad_mascota: edadNum,
      telefono_tutor: formData.telefono_tutor,
      zona_residente: formData.zona_residente,
    };

    onSubmit(newItem);
    onOpenChange(false);

    setFormData({
      nombre_mascota: '',
      especie: '',
      raza: '',
      edad_mascota: '',
      nombre_tutor: '',
      telefono_tutor: '',
      zona_residente: '',
      email_contacto: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>🐾</span>
            Registrar Nueva Mascota
          </DialogTitle>
          <DialogDescription>
            Complete los datos para registrar una nueva mascota en el sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mascota */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_mascota">Nombre de la Mascota *</Label>
              <Input
                id="nombre_mascota"
                value={formData.nombre_mascota}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre_mascota: e.target.value }))}
                placeholder="Ej: Luna"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="especie">Especie *</Label>
              <Select
                value={formData.especie}
                onValueChange={(value) => setFormData(prev => ({ ...prev, especie: value }))}
              >
                <SelectTrigger id="especie">
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Perro">Perro</SelectItem>
                  <SelectItem value="Gato">Gato</SelectItem>
                  <SelectItem value="Ave">Ave</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="raza">Raza</Label>
              <Input
                id="raza"
                value={formData.raza}
                onChange={(e) => setFormData(prev => ({ ...prev, raza: e.target.value }))}
                placeholder="Ej: Golden Retriever"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edad_mascota">Edad (años)</Label>
              <Input
                id="edad_mascota"
                type="number"
                min={0}
                value={formData.edad_mascota}
                onChange={(e) => setFormData(prev => ({ ...prev, edad_mascota: e.target.value }))}
                placeholder="Ej: 3"
              />
            </div>
          </div>

          {/* Tutor */}
          <div className="space-y-2">
            <Label htmlFor="nombre_tutor">Nombre del Tutor *</Label>
            <Input
              id="nombre_tutor"
              value={formData.nombre_tutor}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre_tutor: e.target.value }))}
              placeholder="Ej: María García"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono_tutor">Teléfono del Tutor</Label>
              <Input
                id="telefono_tutor"
                value={formData.telefono_tutor}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono_tutor: e.target.value }))}
                placeholder="Ej: +57 300 123 4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zona_residente">Zona Residente</Label>
              <Input
                id="zona_residente"
                value={formData.zona_residente}
                onChange={(e) => setFormData(prev => ({ ...prev, zona_residente: e.target.value }))}
                placeholder="Ej: Comuna 3 / Barrio Centro"
              />
            </div>
          </div>

          {/* Contacto (tu flujo) */}
          <div className="space-y-2">
            <Label htmlFor="email_contacto">Email de Contacto *</Label>
            <Input
              id="email_contacto"
              type="email"
              value={formData.email_contacto}
              onChange={(e) => setFormData(prev => ({ ...prev, email_contacto: e.target.value }))}
              placeholder="Ej: correo@ejemplo.com"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar Mascota</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterMascotaDialog;
