// API response types matching backend
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Entity types
export enum SolicitudTipo {
  EMPRENDEDOR = 'emprendedor',
  MASCOTA = 'mascota'
}

export enum SolicitudEstado {
  PENDIENTE = 'pendiente',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado'
}

export enum SolicitudOrigen {
  FORMULARIO = 'formulario',
  MANUAL = 'manual'
}

export enum TipoPersona {
  NATURAL = 'natural',
  JURIDICA = 'juridica'
}

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

export interface DetallesEmprendedor {
  id_solicitud: number;
  documento_titular: string;
  razon_social: string;
  nombre_comercial?: string;
  registro_fiscal?: string;
  descripcion_actividad?: string;
  tipo_persona: TipoPersona;
  direccion_fisica: string;
  telefono_contacto: string;
  fecha_vencimiento?: string;
  rubro?: string;
}

export interface DetallesMascota {
  id_solicitud: number;
  nombre_mascota: string;
  especie: string;
  raza: string;
  nombre_tutor: string;
}

export interface SolicitudConDetalles extends Solicitud {
  detalles?: DetallesEmprendedor | DetallesMascota;
}

// Request types
export interface CreateSolicitudRequest {
  tipo_solicitud: SolicitudTipo;
  origen: SolicitudOrigen;
  email_contacto: string;
  detalles: DetallesEmprendedor | DetallesMascota;
}

export interface UpdateSolicitudRequest {
  estado?: SolicitudEstado;
  email_contacto?: string;
}

export interface SolicitudFilters {
  estado?: SolicitudEstado;
  tipo_solicitud?: SolicitudTipo;
  origen?: SolicitudOrigen;
  email_contacto?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  page?: number;
  limit?: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

// Combined entity types for frontend display
export interface Emprendedor extends Solicitud, DetallesEmprendedor {}

export interface Mascota extends Solicitud, DetallesMascota {}

// Statistics types
export interface StatsResponse {
  total: number;
  pendientes: number;
  aprobados: number;
  rechazados: number;
  [key: string]: any;
}