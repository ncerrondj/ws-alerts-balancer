import { forwardRef, Module } from '@nestjs/common';
import { RequestQueueService } from './services/request-queue-service.service';
import { WsConnectionsService } from './services/ws-connections.service';
import { AlertsRequestManagementGateway } from './gateways/alerts-request-management.gateway';
import { AlertsBodyCacheService } from './services/alerts-body-cache.service';
import { AlertsBodyCacheController } from './controllers/alerts-body-cache.controller';
import { LogsController } from './controllers/logs.controller';
import { MessageModule } from 'src/messages/message.module';

@Module({
  providers: [
    RequestQueueService,
    WsConnectionsService,
    AlertsRequestManagementGateway,
    AlertsBodyCacheService,
  ],
  controllers: [AlertsBodyCacheController, LogsController],
  exports: [WsConnectionsService],
  imports: [
    forwardRef(() => MessageModule),
  ],
})
export class AlertsRequestManagementModule {}
