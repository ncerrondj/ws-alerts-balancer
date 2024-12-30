import { Controller, Get } from '@nestjs/common';
import { RequestQueueService } from '../services/request-queue-service.service';

@Controller('logs')
export class LogsController {
  constructor(
    private readonly requestQueueService: RequestQueueService,
  ) {}
  @Get()
  getLogs() {
    return this.requestQueueService.getLogs();
  }
}