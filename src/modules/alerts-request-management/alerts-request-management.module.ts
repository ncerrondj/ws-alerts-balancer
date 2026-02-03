import { forwardRef, Module } from '@nestjs/common';
import { RequestQueueService } from './services/request-queue-service.service';
import { WsConnectionsService } from './services/ws-connections.service';
import { AlertsRequestManagementGateway } from './gateways/alerts-request-management.gateway';
import { AlertsBodyCacheService } from './services/alerts-body-cache.service';
import { AlertsBodyCacheController } from './controllers/alerts-body-cache.controller';
import { LogsController } from './controllers/logs.controller';
import { MessageModule } from '../../messages/message.module';
import { AlertNotificationGateway } from './gateways/alert-notification.gateway';
import { AlertNotificationService } from './services/alert-notifications.service';
import { HttpServiceImpl } from './services/htpp-service.service';
import { HttpModule } from '@nestjs/axios';
import { WsAlertsConnectionsService } from './services/ws-alerts-connections.service';
import { AlertNotificationController } from './controllers/alert-notification.controller';
import { LocksCaprinetModule } from '../locks-caprinet/locks-caprinet.module';
import { AlertNotificationConfigRepository } from './repositories/alert-notification-config.repository';
import { DatabaseModule } from '../../database/database.module';
import { PopUpsModule } from '../pop-ups/pop-ups.module';
import { AlertsRepository } from './repositories/alerts.repository';

@Module({
  providers: [
    RequestQueueService,
    WsConnectionsService,
    AlertNotificationService,
    AlertsRequestManagementGateway,
    WsAlertsConnectionsService,
    AlertsBodyCacheService,
    AlertNotificationGateway,
    HttpServiceImpl,
    AlertNotificationConfigRepository,
    AlertsRepository
  ],
  controllers: [AlertsBodyCacheController, LogsController, AlertNotificationController],
  exports: [WsConnectionsService, WsAlertsConnectionsService, AlertNotificationService],
  imports: [
    forwardRef(() => MessageModule),
    HttpModule,
    forwardRef(() => LocksCaprinetModule),
    PopUpsModule,
    DatabaseModule
  ],
})
export class AlertsRequestManagementModule {}
