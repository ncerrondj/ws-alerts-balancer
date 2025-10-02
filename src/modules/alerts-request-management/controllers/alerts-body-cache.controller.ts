import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AlertsBodyCacheService } from '../../alerts-request-management/services/alerts-body-cache.service';
import { WsConnectionsService } from '../services/ws-connections.service';
import { RequestQueueService } from '../services/request-queue-service.service';

@Controller('alerts-request-management')
export class AlertsBodyCacheController {
  constructor(
    private readonly alertsBodyCacheService: AlertsBodyCacheService,
    private readonly wsConnectionsService: WsConnectionsService,
    private readonly requestQueueService: RequestQueueService,
  ) {}

  @Get('get-alert-body-by-user-id/:userId')
  getAlertBodyByUserId(
    @Param('userId') userId: string,
  ) {
    return this.alertsBodyCacheService.getAlertBodyByUserIdFromCache(userId);
  }
  @Get('cache/:userId')
  getCache(@Param('userId') userId: string) {
    return this.alertsBodyCacheService.rawCache(userId);
  }
  @Post('set-alert-body-by-user-id/:userId')
  setAlertBodyByUserId(
    @Param('userId') userId: string,
    @Body() body: any,
  ) {
    return this.alertsBodyCacheService.setAlertBodyByUserIdInCache(
      userId,
      body,
    );
  }
  @Get('get-connected-users')
  getConnectedUsers() {
    return this.wsConnectionsService.getConnectedUsers();
  }

  @Get('get-user-connections/:userId')
  getUserConnections(@Param('userId') userId: string) {
    const userConnections =  this.wsConnectionsService.getConnections(userId);
    if (userConnections.length === 0) {
      return 'No hay conexiones para el usuario';
    }
    return userConnections.map((c) => c.id);
  }
  @Get('ver-cola')
  verCola() {
    return this.requestQueueService.getQueue();
  }
  @Get('logs')
  getLogs() {
    return this.requestQueueService.getLogs();
  }

}
