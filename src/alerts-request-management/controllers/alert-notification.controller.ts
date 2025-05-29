import { Body, Controller, Get, Post } from '@nestjs/common';
import { RemoveAlertNotificaionDto } from '../model/remove-alert-notifications.dto';
import { AlertNotificationService } from '../services/alert-notifications.service';
import { MarkNotificationAsRead } from '../model/mark-notification-as-read.dto';

@Controller('alert-notification')
export class AlertNotificationController {

  constructor(
    private readonly alertNotificationService: AlertNotificationService
  ) {}

  @Post('remove-notification')
  removeAlertNotification(
    @Body() data: RemoveAlertNotificaionDto
  ) {
    this.alertNotificationService.removeNotification(data);
  }
  @Post('mark-notificacion-as-read')
  markNotificationAsRead(
    @Body() data: MarkNotificationAsRead
  ) {
    this.alertNotificationService.markNotificationAsRead(data);
  }
}