import { Socket } from 'socket.io';
export interface ClientParameters {
  connections: Socket[];
  lastAlertsData: any;
}
export interface ClientGroups {
  [userId: string]: ClientParameters;
}
export interface IClientConnections {
  userId: string;
  connections: Socket[];
}
