import { Injectable } from '@nestjs/common';
import { ClientGroups } from '../interfaces/client-groups.interface';
import { Socket } from 'socket.io';

import { SuscribePayload } from '../model/suscribe.payload';
@Injectable()
export class WsAlertsConnectionsService {
  
  
  getLogs() {
    const userConnections: { [key: string]: any } = {};
    const logs: { [key: string]: any } = {};
    const userIds = this.getConnectedUsers();
    for (const userId of userIds) {
      const parameters = this.getClientParameters(userId);
      userConnections[userId] = {
        TotalConnections: this.getConnections(userId).length,
        Connections: this.getConnections(userId)
          .map((c) => c.id),
        PerfilIds: parameters.perfilIds,
      };
    }
    logs.TotalConnections = this.getAllConnections().length;
    logs.ConnectedUsers = userIds.length;
    logs.UserConnections = userConnections;
    return logs;
  }
  
  private readonly connections: ClientGroups = {};

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

  getConnectedUsers() {
    return Object.keys(this.connections);
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
}
