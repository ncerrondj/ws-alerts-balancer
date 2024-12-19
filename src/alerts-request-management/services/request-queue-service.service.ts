import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Cron } from '@nestjs/schedule';
import { WsConnectionsService } from './ws-connections.service';
import { ALERT_REQUEST_MANAGEMENT_EVENTS } from '../enums/alerts-request-management-action.enum';
@Injectable()
export class RequestQueueService {
  private queue: Socket[] = [];
  constructor(private readonly wsConnectionsService: WsConnectionsService) {}

  @Cron('*/3 * * * * *') // Every 3 seconds
  handleQueue() {
    if (!this.queue.length) {
      return;
    }
    const client = this.queue[0];
    console.log(`\n`);
    console.log(`Manejando Cola para el socket ${client.id}.`);
    const userId = this.wsConnectionsService.getUserId(client);
    console.log(`El usuario es ${userId}.`);
    const clientParameters =
      this.wsConnectionsService.getClientParameters(userId);
    console.log(
      `Los parametros del cliente son ${JSON.stringify(
        {
          connectionsIds: clientParameters?.connections.map((c) => c.id),
          lastAlertsData: clientParameters?.lastAlertsData ? 'Si' : 'No',
        },
        null,
        2,
      )}.`,
    );
    console.log(`\n`);
    client.emit(ALERT_REQUEST_MANAGEMENT_EVENTS.GET_ALERTS_ALLOWED, {
      resendForCaching: !Boolean(clientParameters.lastAlertsData),
    });
    this.queue = this.queue.slice(1);
  }
  shareAlertsBody(client: Socket, payload: any) {
    const userId = this.wsConnectionsService.getUserId(client);
    if (!userId) {
      throw new Error('User not suscribed');
    }
    const connections = this.wsConnectionsService.getConnections(userId);
    this.wsConnectionsService.getClientParameters(userId).lastAlertsData =
      payload;
    const childConnections = connections.filter((c) => c.id !== client.id);
    console.log(`\n`);
    console.log(
      `Enviando alertas a ${childConnections.length} sockets, del usuario ${userId}. Conexiones: ${childConnections.map((c) => c.id).join(', ')}.`,
    );
    console.log(`\n`);
    childConnections.forEach((c) => {
      c.emit(
        ALERT_REQUEST_MANAGEMENT_EVENTS.LOAD_ALERTS_FROM_FIRST_EXECUTOR,
        payload,
      );
    });
  }
  addRequestToQueue(client: Socket) {
    const userId = this.wsConnectionsService.getUserId(client);
    if (!userId) {
      throw new Error('User not suscribed');
    }
    const isTheFirstConnection =
      this.wsConnectionsService.getConnections(userId).at(0)?.id === client.id;
    if (!isTheFirstConnection || this.queue.some((c) => c.id === client.id)) {
      return;
    }
    console.log(`\n`);
    console.log(
      `Añadiendo el socket ${client.id} del usuario ${userId} a la cola.`,
    );
    console.log(`\n`);
    this.queue.push(client);
  }
  forceRequest(client: Socket) {
    const userId = this.wsConnectionsService.getUserId(client);
    if (!userId) {
      throw new Error('User not suscribed');
    }
    const clientParameters =
      this.wsConnectionsService.getClientParameters(userId);
    console.log(`\n`);
    console.log(
      `Forzando petición de alertas para el socket ${client.id} del usuario ${userId}.`,
    );
    console.log(`\n`);
    client.emit(ALERT_REQUEST_MANAGEMENT_EVENTS.GET_ALERTS_ALLOWED, {
      force: true,
      resendForCaching: !Boolean(clientParameters.lastAlertsData),
    });
  }
  sendCachedData(client: Socket) {
    const userId = this.wsConnectionsService.getUserId(client);
    if (!userId) {
      throw new Error('User not suscribed');
    }
    const lastAlertsData =
      this.wsConnectionsService.getClientParameters(userId).lastAlertsData;
    console.log(`\n`);
    console.log(
      `Enviando datos cacheados al socket ${client.id} del usuario ${userId}.`,
    );
    console.log(`\n`);
    client.emit(
      ALERT_REQUEST_MANAGEMENT_EVENTS.LOAD_ALERTS_FROM_FIRST_EXECUTOR,
      lastAlertsData,
    );
  }
}
