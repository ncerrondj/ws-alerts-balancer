export enum ALERT_NOTIFICATIONS_MANAGEMENT_ACTIONS {
  SUBSCRIBE = 'subscribe',
  EMIT_ALERT = 'emit-alert'
}

export enum ALERT_NOTIFICATIONS_MANAGEMENT_EVENT {
   EMIT_ALERT_TO_USER = 'alert-notification-',
   REMOVE_ALERT_TO_USER = 'remove-alert-',
   MARK_ALERT_AS_READ_FOR_USER = 'mark-notification-as-read-',
   EMISSION_RESPONSE = 'respuesta-emision'
}