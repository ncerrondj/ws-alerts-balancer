import { Module } from '@nestjs/common';
import { RequestQueueService } from './services/request-queue-service.service';
import { WsConnectionsService } from './services/ws-connections.service';
import { AlertsRequestManagementGateway } from './gateways/alerts-request-management.gateway';

@Module({
  providers: [
    RequestQueueService,
    WsConnectionsService,
    AlertsRequestManagementGateway,
  ],
})
export class AlertsRequestManagementModule {}
