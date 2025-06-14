export class BaseAlert<T> {
  CODIGO_ALERTA: string;
  CODIGO_TIPO_ALERTA: string;
  CODIGO_USUARIO_ORIGEN: string;
  TITULO: string;
  URL_REDIRECCION: string;
  COLOR_TIPO_ALERTA: string;
  CUERPO_ALERTA: T;
  FECHA_CREACION: string;
  CODIGO_RECEPCION: string;
  MARCADO_LEIDO: boolean;
  CODIGOS_USUARIOS_OBJETIVOS: string[];
}
