import { Socket } from 'socket.io';
export interface ClientParameters {
  connections: Socket[];
  perfilId: string;
}
export interface ClientGroups {
  [userId: string]: ClientParameters;
}
export interface IClientConnections {
  userId: string;
  connections: Socket[];
}
