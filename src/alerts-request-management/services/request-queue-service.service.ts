import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Cron, Interval } from '@nestjs/schedule';
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
  @Interval(2000) // Every 2 seconds
  async handleQueue() {
    if (!this.queue.length) {
      return;
    }
    const client = this.queue[0];
    const userId = this.wsConnectionsService.getUserId(client);
    const clientParameters =
      this.wsConnectionsService.getClientParameters(userId);
    const isSet = await this.cacheManager.get<boolean>(userId + '_is_set');
    console.log({ isSet });
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
  //cron 5 minutos
  @Cron('0 */2 * * * *')
  async clearCache() {
    const limit = 5;
    console.log(`\n`);
    console.log(`Limpiando cache de alertas que no se han enviado en los ultimos ${limit} minutos.`);
    console.log(`\n`);
    const userIdsCleaned = this.wsConnectionsService.cleanCacheWithMoreMinutesThatNotWasCached(limit);
    if (!userIdsCleaned.length) {
      console.log(`\n`);
      console.log(`No se encontraron usuarios con cache por limpiar.`);
      console.log(`\n`);
      return;
    }
    console.log(`\n`);
    console.log(`Se limpiaron los usuarios ${userIdsCleaned.join(', ')}.`);
    console.log(`\n`);
  }
  shareAlertsBody(client: Socket, payload: any) {
    const userId = this.wsConnectionsService.getUserId(client);
    if (!userId) {
      throw new Error('User not suscribed');
    }
    this.wsConnectionsService.cleanEmptyConnections(userId);
    const connections = this.wsConnectionsService.getConnections(userId);
    this.cacheManager.set(userId, JSON.stringify(payload));
    this.cacheManager.set(userId + '_is_set', true);
    this.wsConnectionsService.setLastTimeCached(userId);
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
    this.wsConnectionsService.cleanEmptyConnections(userId);
    const connections = this.wsConnectionsService.getConnections(userId);

    const isTheFirstConnection = connections && connections[0]?.id === client.id;
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
  async getLogs() {
    const userConnections: { [key: string]: any } = {};
    const logs: { [key: string]: any } = {};
    const userIds = this.wsConnectionsService
    .getConnectedUsers();
    for (const userId of userIds) {
      const parameters = this.wsConnectionsService.getClientParameters(userId);
      let LastTimeCached = '';
      if (parameters.lastTimeCached) {
        LastTimeCached =
          parameters.lastTimeCached.toLocaleDateString() +
          ' ' +
          parameters.lastTimeCached.toLocaleTimeString();
      }
      userConnections[userId] = {
        TotalConnections: this.wsConnectionsService.getConnections(userId).length,
        Connections: this.wsConnectionsService
          .getConnections(userId)
          .map((c) => c.id),
        PerfilIds: parameters.perfilIds,
        LastTimeCached,
        isThereDataOnCache: Boolean(await this.cacheManager.get(userId + '_is_set')),
      };
    }
    logs.TotalConnections = this.wsConnectionsService.getAllConnections().length;
    logs.ConnectedUsers = userIds.length;
    logs.UserConnections = userConnections;
    return logs;
  }
}
