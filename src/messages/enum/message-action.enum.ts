export enum MESSAGE_ACTIONS {
  PENDING_REQUESTS_WERE_ADDED_BY_USER = 'message-ingreso-solicitudes-pendientes-ingresadas-por-usuario',
  SIMPLE_CUSTOM_MESSAGE_CLOSED_BY_USER = 'cerrar-mensaje-personalizado', // + userId
}
export enum MESSAGE_EVENTS {
  MESSAGE = 'message',
  SIMPLE_CUSTOM_MESSAGE_BY_PERFIL = 'simple-custom-message-perfil-',
  SIMPLE_CUSTOM_MESSAGE = 'simple-custom-message',
  CAPRINET_RELOAD = 'caprinet-reload',
  CAPRINET_RELOAD_BY_PERFIL = 'caprinet-reload-perfil-',
  MESSAGE_BY_PERFIL = 'message-perfil-',
  PENDING_REQUESTS_BY_PERFIL = 'message-ingreso-solicitudes-pendientes-',
  PENDING_REQUESTS_BY_USER = 'message-ingreso-solicitudes-pendientes-user-',
  PENDING_REQUESTS_WERE_ADDED_BY_USER = 'message-ingreso-solicitudes-pendientes-ingresadas-por-usuario-',
  CLOSE_SIMPLE_CUSTOM_MESSAGE_BY_USER = 'cerrar-mensajes-personalizados-' // + userId
}