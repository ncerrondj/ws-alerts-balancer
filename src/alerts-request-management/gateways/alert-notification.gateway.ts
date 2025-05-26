import { Server, Socket } from 'socket.io';
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SuscribePayload } from '../model/suscribe.payload';
import { ALERT_NOTIFICATIONS_MANAGEMENT_ACTIONS } from '../enums/alert-notifications-management-action.enum';
import { WsAlertsConnectionsService } from '../services/ws-alerts-connections.service';
import { EmitAlertMessagePayload } from '../model/emit-alert-message.payload';
import { AlertNotificationService } from '../services/alert-notifications.service';

@WebSocketGateway({
  namespace: 'alert-notification',
  cors: { origin: '*' },
  pingInterval: 10000, // 10 seconds, intervalo de tiempo entre pings para mantener la conexión
  pingTimeout: 10000, // 10 seconds, si no responde en este tiempo se cierra la conexión
})
export class AlertNotificationGateway implements OnGatewayDisconnect {
   @WebSocketServer() server: Server;
   constructor(
    private readonly wsAlertsConnectionsService: WsAlertsConnectionsService,
    private readonly alertNotificationService: AlertNotificationService
   ) {}

  handleDisconnect(client: Socket) {
    this.wsAlertsConnectionsService.removeConnection(client);
  }

  @SubscribeMessage(ALERT_NOTIFICATIONS_MANAGEMENT_ACTIONS.SUBSCRIBE)
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SuscribePayload,
  ) {
    this.wsAlertsConnectionsService.addConnectionIfNecessary(payload, client);
  }

  @SubscribeMessage(ALERT_NOTIFICATIONS_MANAGEMENT_ACTIONS.EMIT_ALERT)
  emitAlert(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: EmitAlertMessagePayload
  ) {
    this.wsAlertsConnectionsService.addConnectionIfNecessary(payload, client);
    this.alertNotificationService.emitMessage(payload);
  }
}