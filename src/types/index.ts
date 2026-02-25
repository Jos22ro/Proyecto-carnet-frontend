export type SolicitudTipo = 'emprendedor' | 'mascota';
export type SolicitudEstado = 'pendiente' | 'aprobado' | 'rechazado';
export type SolicitudOrigen = 'formulario' | 'manual';

export interface Solicitud {
  id_solicitud: number;
  tipo_solicitud: SolicitudTipo;
  estado: SolicitudEstado;
  origen: SolicitudOrigen;
  email_contacto: string;
  codigo_qr_hash: string;
  fecha_creacion: string;
  fecha_aprobacion?: string;
}

export interface DetalleMascota {
  id_solicitud: number;
  nombre_mascota: string;
  especie: string;
  raza?: string;
  nombre_tutor: string;
  edad_mascota: number;
  telefono_tutor: string;
  zona_residente: string;
}

export interface DetalleEmprendedor {
  id_solicitud: number;
  rubro?: string;
  documento_titular: string;
  razon_social: string;
  nombre_comercial?: string;
  registro_fiscal?: string;
  descripcion_actividad?: string;
  tipo_persona?: 'natural' | 'juridica';
  direccion_fisica?: string;
  telefono_contacto?: string;
  fecha_vencimiento?: string;
}

export interface LogEnvio {
  id_log: number;
  id_solicitud: number;
  email_enviado: string;
  fecha_envio: string;
  resultado: 'éxito' | 'error';
  mensaje_error?: string;
}

// Combined view types
export interface SolicitudMascota extends Solicitud, DetalleMascota { }
export interface SolicitudEmprendedor extends Solicitud, DetalleEmprendedor { }

export interface CategoryStats {
  total: number;
  pendiente: number;
  aprobado: number;
  rechazado: number;
}
