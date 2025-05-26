import { Body, Controller, Post } from '@nestjs/common';
import { RemoveAlertNotificaionDto } from '../model/remove-alert-notifications.dto';
import { AlertNotificationService } from '../services/alert-notifications.service';

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
}