import { Injectable } from '@nestjs/common';
import { WsConnectionsService } from 'src/alerts-request-management/services/ws-connections.service';
import { Socket } from 'socket.io';
import { SuscribePayload } from 'src/alerts-request-management/model/suscribe.payload';
import { MESSAGE_EVENTS } from '../enum/message-action.enum';
import { MessageDto } from '../model/message.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly wsConnectionsService: WsConnectionsService
  ) {}
  handlePendingRequestsWereAddedByUser(
    client: Socket,
    data: SuscribePayload
  ) {
    this.wsConnectionsService.addConnectionIfNecessary(data, client);
    this.wsConnectionsService.getConnections(data.userId).forEach((c) => {
      c.emit(MESSAGE_EVENTS.PENDING_REQUESTS_WERE_ADDED_BY_USER + data.userId
      );
    });
  }
  handleSimpleMessageClosedByUser(
    client: Socket,
    data: SuscribePayload
  ) {
    this.wsConnectionsService.addConnectionIfNecessary(data, client);
    this.wsConnectionsService.getConnections(data.userId).forEach((c) => {
      c.emit(MESSAGE_EVENTS.CLOSE_SIMPLE_CUSTOM_MESSAGE_BY_USER + data.userId
      );
  } );
  }
  sendSimpleMessage(messageDto: MessageDto, perfilId?: number) {
    console.log({messageDto, perfilId});
    const connections: Socket[] = this.getConnectionsByOptionalPerfilId(perfilId);
    const {message, title, userIdsToExcludeOfNotification = []} = messageDto;
    const event = perfilId ? MESSAGE_EVENTS.SIMPLE_CUSTOM_MESSAGE_BY_PERFIL + perfilId : MESSAGE_EVENTS.SIMPLE_CUSTOM_MESSAGE;
    connections.forEach((client) => {
      const userId = this.wsConnectionsService.getUserId(client);
      if (userIdsToExcludeOfNotification.length && userIdsToExcludeOfNotification.includes(userId)) {
        return;
      }
      
      client.emit(event, {message, title});
    });
    return 'Mensaje enviado';
  }
  sendReloadCaprinetMessage(messageDto: MessageDto, perfilId?: number) {
    const connections: Socket[] = this.getConnectionsByOptionalPerfilId(perfilId);
    const {message, title, userIdsToExcludeOfNotification = []} = messageDto;
    const event = perfilId ? MESSAGE_EVENTS.CAPRINET_RELOAD_BY_PERFIL + perfilId : MESSAGE_EVENTS.CAPRINET_RELOAD;
    connections.forEach((client) => {
      const userId = this.wsConnectionsService.getUserId(client);
      if (userIdsToExcludeOfNotification.length && userIdsToExcludeOfNotification.includes(userId)) {
        return;
      }
      client.emit(event, {message, title});
    });
    return 'Mensaje enviado';
  }
  private getConnectionsByOptionalPerfilId(perfilId?: number) {
    return perfilId ? this.wsConnectionsService.getAllConnectionByPerfilId(perfilId.toString()) : this.wsConnectionsService.getAllConnections();
  }
}