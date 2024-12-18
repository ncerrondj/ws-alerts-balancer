import { Injectable } from '@nestjs/common';
import { ClientGroups } from '../interfaces/client-groups.interface';
import { Socket } from 'socket.io';
@Injectable()
export class WsConnectionsService {
  private readonly connections: ClientGroups = {};

  addConnectionIfNecessary(userId: string, client: Socket) {
    if (!this.connections[userId]) {
      this.connections[userId] = {
        connections: [],
        lastAlertsData: null,
      };
    }
    if (this.connections[userId].connections.some((c) => c.id === client.id)) {
      return;
    }
    this.connections[userId].connections.push(client);
  }
  removeConnection(client: Socket) {
    Object.keys(this.connections).forEach((userId) => {
      const clientRef = this.connections[userId].connections.find(
        (c) => c.id === client.id,
      );
      if (clientRef) {
        this.connections[userId].connections = this.connections[
          userId
        ].connections.filter((c) => c.id !== client.id);
        if (this.connections[userId].connections.length === 0) {
          delete this.connections[userId];
        }
      }
    });
  }
  getConnections(userId: string): Socket[] {
    return this.connections[userId]?.connections || [];
  }
  getClientParameters(userId: string) {
    return this.connections[userId];
  }
  getUserId(client: Socket): string {
    return Object.keys(this.connections).find((userId) =>
      this.connections[userId]?.connections.some((c) => c.id === client.id),
    );
  }
  setCachedData(client: Socket, data: any) {
    const userId = this.getUserId(client);
    if (!userId) {
      throw new Error('User not suscribed');
    }
    this.connections[userId].lastAlertsData = data;
  }
}
