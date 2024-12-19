import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WsConnectionsService } from '../services/ws-connections.service';
import { ALERT_REQUEST_MANAGEMENT_ACTIONS } from '../enums/alerts-request-management-action.enum';
import { Socket } from 'socket.io';
import { SuscribePayload } from '../model/suscribe.payload';
import { RequestQueueService } from '../services/request-queue-service.service';
import { ShareAlertBodyPayload } from '../model/share-alert-body.payload';
import { AskForPermissionForGetAlertsPayload } from '../model/ask-for-permission_for_get_alerts.payload';
import { SetCachedDataPayload } from '../model/set-cached-data.payload';
@WebSocketGateway({
  namespace: 'alerts-request-management',
  cors: { origin: '*' },
  maxHttpBufferSize: 15e6, // 15 MB
  pingInterval: 10000, // 10 seconds, intervalo de tiempo entre pings para mantener la conexión
  pingTimeout: 10000, // 10 seconds, si no responde en este tiempo se cierra la conexión
})
export class AlertsRequestManagementGateway implements OnGatewayDisconnect {
  constructor(
    private readonly wsConnectionsService: WsConnectionsService,
    private readonly requestQueueService: RequestQueueService,
  ) {}

  handleDisconnect(client: Socket) {
    this.wsConnectionsService.removeConnection(client);
  }

  @SubscribeMessage(ALERT_REQUEST_MANAGEMENT_ACTIONS.SUSCRIBE)
  handleSuscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SuscribePayload,
  ) {
    this.wsConnectionsService.addConnectionIfNecessary(payload.userId, client);
  }

  @SubscribeMessage(
    ALERT_REQUEST_MANAGEMENT_ACTIONS.ASK_FOR_PERMISSION_FOR_GET_ALERTS,
  )
  handleAskForPermissionForGetAlerts(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: AskForPermissionForGetAlertsPayload,
  ) {
    this.wsConnectionsService.addConnectionIfNecessary(payload.userId, client);
    if (payload?.force) {
      this.requestQueueService.forceRequest(client);
      return;
    }
    if (payload?.cache) {
      this.requestQueueService.sendCachedData(client);
      return;
    }
    this.requestQueueService.addRequestToQueue(client);
  }
  @SubscribeMessage(ALERT_REQUEST_MANAGEMENT_ACTIONS.SET_CACHED_DATA)
  handleSetCachedData(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SetCachedDataPayload,
  ) {
    this.wsConnectionsService.addConnectionIfNecessary(payload.userId, client);
    this.wsConnectionsService.setCachedData(client, payload.data);
  }

  @SubscribeMessage(ALERT_REQUEST_MANAGEMENT_ACTIONS.SHARE_ALERTS_BODY)
  handleShareAlertsBody(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ShareAlertBodyPayload,
  ) {
    this.wsConnectionsService.addConnectionIfNecessary(payload.userId, client);
    this.requestQueueService.shareAlertsBody(client, payload.alertBody);
  }
}
