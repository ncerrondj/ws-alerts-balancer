import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Interval } from '@nestjs/schedule';
import { WsConnectionsService } from './ws-connections.service';
import { ALERT_REQUEST_MANAGEMENT_EVENTS } from '../enums/alerts-request-management-action.enum';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class RequestQueueService {
  private queue: Socket[] = [];
  constructor(
    private readonly wsConnectionsService: WsConnectionsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // @Cron('*/2 * * * * *') // Every 2 seconds
  @Interval(1500) // Every 1.5 seconds
  async handleQueue() {
    if (!this.queue.length) {
      return;
    }
    const client = this.queue[0];
    const userId = this.wsConnectionsService.getUserId(client);
    const clientParameters =
      this.wsConnectionsService.getClientParameters(userId);
    const isSet = await this.cacheManager.get<boolean>(userId + '_is_set');
    console.log(`\n`);
    console.log(`Manejando Cola para el socket ${client.id}.`);
    console.log(`El usuario es ${userId}.`);
    console.log(
      `Los parametros del cliente son ${JSON.stringify(
        {
          connectionsIds: clientParameters?.connections.map((c) => c.id),
          bodyInCache: isSet ? 'Si' : 'No',
        },
        null,
        2,
      )}.`,
    );
    console.log(`\n`);
    client.emit(ALERT_REQUEST_MANAGEMENT_EVENTS.GET_ALERTS_ALLOWED, {
      resendForCaching: !isSet,
    });
    this.queue = this.queue.slice(1);
  }
  shareAlertsBody(client: Socket, payload: any) {
    const userId = this.wsConnectionsService.getUserId(client);
    if (!userId) {
      throw new Error('User not suscribed');
    }
    const connections = this.wsConnectionsService.getConnections(userId);
    this.cacheManager.set(userId, JSON.stringify(payload));
    this.cacheManager.set(userId + '_is_set', true);
    const childConnections = connections.filter((c) => c.id !== client.id);
    console.log(`\n`);
    console.log(
      `Enviando alertas a ${childConnections.length} sockets, del usuario ${userId}. Conexiones: ${childConnections.map((c) => c.id).join(', ')}.`,
    );
    console.log(`\n`);
    childConnections.forEach((c) => {
      c.emit(ALERT_REQUEST_MANAGEMENT_EVENTS.GET_FROM_CACHE_ALLOWED);
    });
  }
  addRequestToQueue(client: Socket) {
    const userId = this.wsConnectionsService.getUserId(client);
    if (!userId) {
      throw new Error('User not suscribed');
    }
    const connections = this.wsConnectionsService.getConnections(userId);
    const isTheFirstConnection = connections && connections[0].id === client.id;
    //this.wsConnectionsService.getConnections(userId).at(0)?.id === client.id;
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
  async forceRequest(client: Socket) {
    const userId = this.wsConnectionsService.getUserId(client);
    if (!userId) {
      throw new Error('User not suscribed');
    }
    console.log(`\n`);
    console.log(
      `Forzando petición de alertas para el socket ${client.id} del usuario ${userId}.`,
    );
    console.log(`\n`);
    client.emit(ALERT_REQUEST_MANAGEMENT_EVENTS.GET_ALERTS_ALLOWED, {
      force: true,
      resendForCaching: !this.cacheManager.get<boolean>(userId + '_is_set'),
    });
  }
  getQueue() {
    return this.queue.map((c) => {
      return {
        userId: this.wsConnectionsService.getUserId(c),
        socketId: c.id,
      };
    });
  }
  getLogs() {
    return {
      TotalConnections: this.wsConnectionsService.getAllConnections().length,
      ConnectedUsers: this.wsConnectionsService.getConnectedUsers().length,
      UserConnections: {
        ...this.wsConnectionsService
          .getConnectedUsers()
          .reduce((acc, userId) => {
            acc[userId] = {
              TotalConnections:
                this.wsConnectionsService.getConnections(userId).length,
              Connections: this.wsConnectionsService
                .getConnections(userId)
                .map((c) => c.id),
            };
            return acc;
          }, {}),
      },
    };
  }
}
