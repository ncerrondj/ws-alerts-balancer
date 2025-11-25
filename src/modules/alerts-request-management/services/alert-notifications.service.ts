import { Socket } from 'socket.io';
import { ALERT_NOTIFICATIONS_MANAGEMENT_EVENT } from '../enums/alert-notifications-management-action.enum';import { EmitAlertMessagePayload } from '../model/emit-alert-message.payload';
import { MarkNotificationAsRead } from '../model/mark-notification-as-read.dto';
import { RemoveAlertNotificaionDto } from '../model/remove-alert-notifications.dto';
import { HttpServiceImpl } from './htpp-service.service';
import { WsAlertsConnectionsService } from './ws-alerts-connections.service';
import { Injectable } from '@nestjs/common';
import { RegisterAlertResponseDto } from '../model/register-response.dto';
import { PostNumerationRepository } from '../../../modules/locks-caprinet/repositories/postnumeration.repository';
import { NotificationGeneralSoundDto } from '../model/notification-general-configuration.dto';
import { AlertNotificationConfigRepository } from '../repositories/alert-notification-config.repository';

@Injectable()
export class AlertNotificationService {
  
  constructor(
    private readonly wsAlertsConnectionsService: WsAlertsConnectionsService,
    private readonly httpService: HttpServiceImpl,
    private readonly postNumerationRepository: PostNumerationRepository,
    private readonly alertNotificationConfigRepository: AlertNotificationConfigRepository
  ) {}

  async emitMessage(payload: EmitAlertMessagePayload, client?: Socket) {
    payload = await this.setDinamicVars(payload);
    const res = await this.httpService.post<any, RegisterAlertResponseDto>({
      path: 'notificacion-alerta/registrar',
      data: payload
    });
    payload.codigoAlerta = res.codigoAlerta;
    res.codigosUsuariosObjetivos?.forEach((userId: string) => {
      const connections = this.wsAlertsConnectionsService.getConnections(userId.toString());
      connections?.forEach(c => {
        c.emit(ALERT_NOTIFICATIONS_MANAGEMENT_EVENT.EMIT_ALERT_TO_USER.concat(userId.toString()), payload);
      });
    });
    if (client) {
      client.emit(ALERT_NOTIFICATIONS_MANAGEMENT_EVENT.EMISSION_RESPONSE, res);
    }
    return res;
  }
  removeNotification(options: RemoveAlertNotificaionDto) {
    options.codigosUsuariosObjetivos.forEach(codUsuario => {
      this.wsAlertsConnectionsService.getConnections(codUsuario).forEach(c => {
        c.emit(ALERT_NOTIFICATIONS_MANAGEMENT_EVENT.REMOVE_ALERT_TO_USER.concat(codUsuario), {
          codigoAlerta: options.codigoAlerta,
          codigoTipoAlerta: options.codigoTipoAlerta
        })
      });
    });
  }
  markNotificationAsRead(options: MarkNotificationAsRead) {
    const {codigoUsuario} = options;
    this.wsAlertsConnectionsService.getConnections(codigoUsuario).forEach(c => {
      c.emit(ALERT_NOTIFICATIONS_MANAGEMENT_EVENT.MARK_ALERT_AS_READ_FOR_USER.concat(codigoUsuario), {
        codigoAlerta: options.codigoAlerta,
        codigoTipoAlerta: options.codigoTipoAlerta
      })
    });
  }
  async setGeneralSound(data: NotificationGeneralSoundDto) {
    const {
      userId,
      generalSound
    } = data;
    await this.alertNotificationConfigRepository.updateGeneralConfig({
      userId: +userId,
      generalSound: generalSound
    });
    this.wsAlertsConnectionsService.sendMessageToUser(userId, ALERT_NOTIFICATIONS_MANAGEMENT_EVENT.GENERAL_SOUND_CHANGE_TO_USER.concat(userId), {
      generalSound
    });
    return {
      ok: true
    };
  }
  private async setDinamicVars(payload: EmitAlertMessagePayload) {
    try {
      if (payload.codigoTipoAlerta == 24 && payload.data?.codigoTipoBloqueo == 7124) { //desbloqueo postnumeracion 
        const postnumerationData = await this.postNumerationRepository.getPostNumerationDataFromLocks(payload.codigoUsuarioOrigen);
        const ordenes = postnumerationData.map(item => item.ORDEN_COMPLETA).join(', ');
        payload.data.ordenes = ordenes ? ordenes : 'Vacío';
      }
      if (payload.codigoTipoAlerta == 24 && payload.data?.codigoTipoBloqueo == 7159) { //desbloqueo regularizacion
        const postnumerationData = await this.postNumerationRepository.getRegularizationDataFromLocks(payload.codigoUsuarioOrigen);
        const ordenes = postnumerationData.map(item => item.ORDEN_COMPLETA).join(', ');
        payload.data.ordenes = ordenes ? ordenes : 'Vacío';
      }
    } catch (error) {
      console.log(error);
    }
    return payload;
  }
  notifyConfigChange(userId: string) {
    this.wsAlertsConnectionsService.sendMessageToUser(userId, ALERT_NOTIFICATIONS_MANAGEMENT_EVENT.CONFIG_CHANGE_TO_USER.concat(userId));
    return {
      ok: true
    };
  }
}