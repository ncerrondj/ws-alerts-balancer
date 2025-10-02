import { WsAlertsConnectionsService } from './../services/ws-alerts-connections.service';
import { Controller, Get } from '@nestjs/common';
import { RequestQueueService } from '../services/request-queue-service.service';

@Controller('logs')
export class LogsController {
  constructor(
    private readonly requestQueueService: RequestQueueService,
    private readonly wsAlertsConnectionsService: WsAlertsConnectionsService,
  ) {}
  @Get()
  getLogs() {
    return this.requestQueueService.getLogs();
  }
  @Get('alerts')
  getLogsAlerts() {
    return this.wsAlertsConnectionsService.getLogs();
  }
}