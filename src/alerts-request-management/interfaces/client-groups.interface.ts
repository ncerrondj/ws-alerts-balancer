import { Socket } from 'socket.io';
export interface ClientParameters {
  connections: Socket[];
  perfilIds: string[];
  lastTimeCached: Date;
}
export interface ClientGroups {
  [userId: string]: ClientParameters;
}
export interface IClientConnections {
  userId: string;
  connections: Socket[];
}
