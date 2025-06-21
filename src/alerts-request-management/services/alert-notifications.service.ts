import { Socket } from 'socket.io';
import { ALERT_NOTIFICATIONS_MANAGEMENT_EVENT } from '../enums/alert-notifications-management-action.enum';import { EmitAlertMessagePayload } from '../model/emit-alert-message.payload';
import { MarkNotificationAsRead } from '../model/mark-notification-as-read.dto';
import { RemoveAlertNotificaionDto } from '../model/remove-alert-notifications.dto';
import { HttpServiceImpl } from './htpp-service.service';
import { WsAlertsConnectionsService } from './ws-alerts-connections.service';
import { Injectable } from '@nestjs/common';
import { RegisterAlertResponseDto } from '../model/register-response.dto';

@Injectable()
export class AlertNotificationService {
  constructor(
    private readonly wsAlertsConnectionsService: WsAlertsConnectionsService,
    private readonly httpService: HttpServiceImpl
  ) {}

  async emitMessage(payload: EmitAlertMessagePayload, client?: Socket) {
    console.log('Emit message');
    console.log({payload});
    const res = await this.httpService.post<any, RegisterAlertResponseDto>({
      path: 'notificacion-alerta/registrar',
      data: payload
    });
    console.log({res});
    payload.codigoAlerta = res.codigoAlerta;
    res.codigosUsuariosObjetivos?.forEach((userId: string) => {
      const connections = this.wsAlertsConnectionsService.getConnections(userId.toString());
      console.log(`Mandando a ${userId}, con ${connections.length} conexiones`);
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
}