import { Inject, Injectable } from '@nestjs/common';
import { ClientGroups } from '../interfaces/client-groups.interface';
import { Socket } from 'socket.io';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SuscribePayload } from '../model/suscribe.payload';
@Injectable()
export class WsConnectionsService {
  
  private readonly connections: ClientGroups = {};
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  addConnectionIfNecessary(suscribePayload: SuscribePayload, client: Socket) {
    const userId = suscribePayload?.userId;
    const {
      perfilId
    } = suscribePayload;
    const perfilIds = perfilId ? perfilId.toString().split(',') : []; 
    if (!this.connections[userId]) {
      this.connections[userId] = {
        connections: [],
        perfilIds: perfilIds,
        lastTimeCached: null,
      };
    }
    if (this.connections[userId].connections.some((c) => c.id === client.id)) {
      return;
    }
    if (!client) {
      return;
    }
    this.connections[userId].connections.push(client);

    //* solo por si acaso pq se metera una actualizacion donde recien se enviara el perfilId progresivamente
    if (!this.connections[userId].perfilIds.length) {
      this.connections[userId].perfilIds = perfilIds;
    }
  }
  removeConnection(client: Socket) {
    const userId = this.getUserId(client);
    if (!userId) {
      return;
    }
    this.connections[userId].connections = this.connections[userId].connections.filter(
      (c) => c.id !== client.id,
    );
    if (this.connections[userId].connections.length === 0) {
      delete this.connections[userId];
      this.cacheManager.del(userId);
      this.cacheManager.del(userId + '_is_set');
    }
  }
  getConnections(userId: string): Socket[] {
    return this.connections[userId]?.connections || [];
  }
  cleanEmptyConnections(userId: string) {
    if (!this.connections[userId]) {
      return;
    }
    this.connections[userId].connections = this.connections[userId].connections.filter(
      (c) => Boolean(c) && Boolean(c?.id) && Boolean(c?.connected),
    );
    if (this.connections[userId].connections.length === 0) {
      delete this.connections[userId];
      this.cacheManager.del(userId);
      this.cacheManager.del(userId + '_is_set');
    }
  }
  getAllConnections() {
    const connections: Socket[] = [];
    Object.keys(this.connections).forEach((userId) => {
      connections.push(...this.connections[userId].connections);
    });
    return connections;
  }
  getClientParameters(userId: string) {
    return this.connections[userId];
  }
  getUserId(client: Socket): string {
    return Object.keys(this.connections).find((userId) =>
      this.connections[userId]?.connections.some((c) => c.id === client.id),
    );
  }
  setClientAsParent(client: Socket) {
    const userId = this.getUserId(client);
    if (!userId) {
      return;
    }
    this.connections[userId].connections = [
      client,
      ...this.connections[userId].connections.filter((c) => c.id !== client.id),
    ];
  }
  getConnectedUsers() {
    return Object.keys(this.connections);
  }
  cleanCacheWithMoreMinutesThatNotWasCached(minutes: number): string[] {
    const users: string[] = [];
    Object.keys(this.connections).forEach((userId) => {
      const lastTimeCached = this.connections[userId].lastTimeCached;
      if (!lastTimeCached) {
        return;
      }
      const now = new Date();
      const diff = now.getTime() - lastTimeCached.getTime();
      
      if (diff > minutes * 60 * 1000) {
        this.cacheManager.del(userId);
        this.cacheManager.del(userId + '_is_set');
        users.push(userId);
      }
    });
    return users;
  }
  getAllConnectionByPerfilId(perfilId: string) {
    const connections: Socket[] = [];
    Object.keys(this.connections).forEach((userId) => {
      const userConnections = this.connections[userId].connections;
      if (this.connections[userId].perfilIds.includes(perfilId)) {
        connections.push(...userConnections);
      }
    });
    return connections;
  }
  setLastTimeCached(userId: string) {
    if (!this.connections[userId]) {
      return;
    }
    this.connections[userId].lastTimeCached = new Date();
  }

}
