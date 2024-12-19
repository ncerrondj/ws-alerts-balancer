import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AlertsBodyCacheService } from 'src/alerts-request-management/services/alerts-body-cache.service';
import { WsConnectionsService } from '../services/ws-connections.service';
import { Socket } from 'socket.io';

@Controller('alerts-request-management')
export class AlertsBodyCacheController {
  constructor(
    private readonly alertsBodyCacheService: AlertsBodyCacheService,
    private readonly wsConnectionsService: WsConnectionsService,
  ) {}

  @Get('get-alert-body-by-user-id/:userId/:socketId')
  getAlertBodyByUserId(
    @Param('userId') userId: string,
    @Param('socketId') socketId: string,
  ) {
    console.log('\n');
    console.log(`El usuario ${userId} solicita del cache.`);
    console.log('\n');
    this.wsConnectionsService.addConnectionIfNecessary(userId, {
      id: socketId,
    } as Socket);
    return this.alertsBodyCacheService.getAlertBodyByUserIdFromCache(userId);
  }
  @Get('cache/:userId')
  getCache(@Param('userId') userId: string) {
    return this.alertsBodyCacheService.rawCache(userId);
  }
  @Post('set-alert-body-by-user-id/:userId/:socketId')
  setAlertBodyByUserId(
    @Param('userId') userId: string,
    @Param('socketId') socketId: string,
    @Body() body: any,
  ) {
    console.log('\n');
    console.log(`El usuario ${userId} solicita guardar en cache.`);
    console.log('\n');
    this.wsConnectionsService.addConnectionIfNecessary(userId, {
      id: socketId,
    } as Socket);
    return this.alertsBodyCacheService.setAlertBodyByUserIdInCache(
      userId,
      body,
    );
  }
}
