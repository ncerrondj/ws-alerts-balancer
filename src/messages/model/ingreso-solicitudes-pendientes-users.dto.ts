export class IngresoSolicitudesPendienteUsersDto {
  message: string;
  title: string;
  userIdsToExcludeOfNotification?: string[];
  userIds: string[];
  codigoNotificacion: string;
}