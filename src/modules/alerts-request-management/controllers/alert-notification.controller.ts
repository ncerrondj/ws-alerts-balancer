import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RemoveAlertNotificaionDto } from '../model/remove-alert-notifications.dto';
import { AlertNotificationService } from '../services/alert-notifications.service';
import { MarkNotificationAsRead } from '../model/mark-notification-as-read.dto';
import { EmitAlertMessagePayload } from '../model/emit-alert-message.payload';
import { BkLocksCaprinetRepository } from '../../locks-caprinet/repositories/bk-locks-caprinet.repository';
import { NotificationGeneralSoundDto } from '../model/notification-general-configuration.dto';

@Controller('alert-notification')
export class AlertNotificationController {

  constructor(
    private readonly alertNotificationService: AlertNotificationService,
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
  @Post('emitir-alerta')
  async emitirAlerta(
    @Body() data: EmitAlertMessagePayload
  ) {
    return await this.alertNotificationService.emitMessage(data);
  }

  @Post('change-general-sound')
  async setGeneralSound(
    @Body() data: NotificationGeneralSoundDto
  ) {
    return await this.alertNotificationService.setGeneralSound(data);
  }
  @Get('notify-config-change/:userId')
  notifyConfigChange(
    @Param('userId') userId: string
  ) {
    return this.alertNotificationService.notifyConfigChange(userId);
  }
}