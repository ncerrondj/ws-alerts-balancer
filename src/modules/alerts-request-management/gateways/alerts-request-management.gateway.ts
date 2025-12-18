import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsConnectionsService } from '../services/ws-connections.service';
import { ALERT_REQUEST_MANAGEMENT_ACTIONS } from '../enums/alerts-request-management-action.enum';
import { Server, Socket } from 'socket.io';
import { SuscribePayload } from '../model/suscribe.payload';
import { RequestQueueService } from '../services/request-queue-service.service';
import { ShareAlertBodyPayload } from '../model/share-alert-body.payload';
import { AskForPermissionForGetAlertsPayload } from '../model/ask-for-permission_for_get_alerts.payload';
import { SetCachedDataPayload } from '../model/set-cached-data.payload';
import { AlertsBodyCacheService } from '../services/alerts-body-cache.service';
import { MessageService } from '../../../messages/services/message.service';
import { MESSAGE_ACTIONS } from '../../../messages/enum/message-action.enum';
import { CloseMessageDto } from '../../../messages/model/close-message.dto';
@WebSocketGateway({
  namespace: 'alerts-request-management',
  cors: { origin: '*' },
  maxHttpBufferSize: 15e6, // 15 MB
  pingInterval: 10000, // 10 seconds, intervalo de tiempo entre pings para mantener la conexión
  pingTimeout: 10000, // 10 seconds, si no responde en este tiempo se cierra la conexión
})
export class AlertsRequestManagementGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(
    private readonly wsConnectionsService: WsConnectionsService,
    private readonly requestQueueService: RequestQueueService,
    private readonly alertsBodyCacheService: AlertsBodyCacheService,
    private readonly messageService: MessageService,
  ) {}

  handleDisconnect(client: Socket) {
    this.wsConnectionsService.removeConnection(client);
  }

  @SubscribeMessage(ALERT_REQUEST_MANAGEMENT_ACTIONS.SUSCRIBE)
  handleSuscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SuscribePayload,
  ) {
    this.wsConnectionsService.addConnectionIfNecessary(payload, client);
  }

  @SubscribeMessage(
    ALERT_REQUEST_MANAGEMENT_ACTIONS.ASK_FOR_PERMISSION_FOR_GET_ALERTS,
  )
  handleAskForPermissionForGetAlerts(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: AskForPermissionForGetAlertsPayload,
  ) {
    this.wsConnectionsService.addConnectionIfNecessary(payload, client);
    if (payload?.force) {
      this.requestQueueService.forceRequest(client);
      return;
    }
    this.requestQueueService.addRequestToQueue(client);
  }
  @SubscribeMessage(ALERT_REQUEST_MANAGEMENT_ACTIONS.SET_CACHED_DATA)
  handleSetCachedData(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SetCachedDataPayload,
  ) {
    this.wsConnectionsService.addConnectionIfNecessary(payload, client);
    this.alertsBodyCacheService.setAlertBodyByUserIdInCache(
      payload.userId,
      payload.data,
    );
  }

  @SubscribeMessage(ALERT_REQUEST_MANAGEMENT_ACTIONS.SHARE_ALERTS_BODY)
  handleShareAlertsBody(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ShareAlertBodyPayload,
  ) {
    this.wsConnectionsService.addConnectionIfNecessary(payload, client);
    this.requestQueueService.shareAlertsBody(client, payload.alertBody);
  }

  @SubscribeMessage(ALERT_REQUEST_MANAGEMENT_ACTIONS.ASK_FOR_TO_BE_THE_PARENT)
  handleAskForToBeTheParent(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SuscribePayload,
  ) {
    this.wsConnectionsService.addConnectionIfNecessary(payload, client);
    this.wsConnectionsService.setClientAsParent(client);
    this.requestQueueService.addRequestToQueue(client);
  }

  @SubscribeMessage(MESSAGE_ACTIONS.PENDING_REQUESTS_WERE_ADDED_BY_USER)
  handlePendingRequestsWereAddedByUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SuscribePayload
  ) {
    this.messageService.handlePendingRequestsWereAddedByUser(client, data);
  }
  @SubscribeMessage(MESSAGE_ACTIONS.SIMPLE_CUSTOM_MESSAGE_CLOSED_BY_USER)
  handleSimpleCustomMessageClosedByUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CloseMessageDto 
  ) {
    this.messageService.handleSimpleMessageClosedByUser(client, data);
  }
}
