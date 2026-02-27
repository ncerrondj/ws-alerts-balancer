import { Socket } from 'socket.io';
import { ALERT_NOTIFICATIONS_MANAGEMENT_EVENT } from '../enums/alert-notifications-management-action.enum';import { EmitAlertMessagePayload } from '../model/emit-alert-message.payload';
import { MarkNotificationAsRead } from '../model/mark-notification-as-read.dto';
import { RemoveAlertNotificaionDto } from '../model/remove-alert-notifications.dto';
import { HttpServiceImpl } from './htpp-service.service';
import { WsAlertsConnectionsService } from './ws-alerts-connections.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RegisterAlertResponseDto } from '../model/register-response.dto';
import { PostNumerationRepository } from '../../../modules/locks-caprinet/repositories/postnumeration.repository';
import { NotificationGeneralSoundDto } from '../model/notification-general-configuration.dto';
import { AlertNotificationConfigRepository } from '../repositories/alert-notification-config.repository';
import { AlertsRepository } from '../repositories/alerts.repository';
import { BkAlertsRepository } from '../repositories/bk-alerts.repository';
import { BkTargetAlertType } from '../../../database/sp/interfaces/bk-alert-params.sp';
import { TaskService } from '../../../modules/tasks/services/task.service';
import { DbUtils } from '../../../database/utils/db.utils';
import { BkTargetHelper } from '../helpers/bk-target.helper';

@Injectable()
export class AlertNotificationService implements OnModuleInit {
  
  constructor(
    private readonly wsAlertsConnectionsService: WsAlertsConnectionsService,
    private readonly httpService: HttpServiceImpl,
    private readonly postNumerationRepository: PostNumerationRepository,
    private readonly alertNotificationConfigRepository: AlertNotificationConfigRepository,
    private readonly alertsRepository: AlertsRepository,
    private readonly bkAlertsRepository: BkAlertsRepository,
    private readonly taskService: TaskService
  ) {}
  onModuleInit() {
    setTimeout(() => {
      this.programProgramedAlertsFromBk();
    }, 2000);
  }

  private async programProgramedAlertsFromBk() {
    const bkAlerts = await this.bkAlertsRepository.getAll({
      aborted: false,
      created: false,
    });
    bkAlerts.forEach(bkAlerta => {
      const programationDatetime = new Date(DbUtils.toJsonDate(bkAlerta.FECHA_HORA_CREACION_ALERTA_PROGRAMADA));
      this.taskService.program(
        'scheduleAlert' + bkAlerta.CODIGO,
        programationDatetime,
        async () => {
          await this.proccessAlert(BkTargetHelper.toEmitAlertMessagePayload(bkAlerta));
          await this.bkAlertsRepository.markAlertCreation(bkAlerta.CODIGO);
        }
      );
    });
  }
  async emitMessage(payload: EmitAlertMessagePayload, client?: Socket) {
    payload = await this.setDinamicVars(payload);
    if (payload.fechaHoraProgramacion) {
      return await this.scheduleAlert(payload);
    }
    const res = await this.proccessAlert(payload);
    if (client) {
      client.emit(ALERT_NOTIFICATIONS_MANAGEMENT_EVENT.EMISSION_RESPONSE, res);
    }
    return res;
  }
  private async proccessAlert(payload: EmitAlertMessagePayload) {
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
    return res;
  }
  async scheduleAlert(payload: EmitAlertMessagePayload) {
    const resCreationBkAlert = await this.bkAlertsRepository.createBkAlert({
      aditionalInformation: payload.informacionAdicional,
      alertTypeId: payload.codigoTipoAlerta,
      title: payload.titulo,
      userId: payload.userId ? +payload.userId : null,
      jsonAlertBody: JSON.stringify(payload.data),
      templateId: payload.codigoPlantilla ? +payload.codigoPlantilla : null,
      redirectionUrl: payload.urlRedireccion,
      autoDestructionDatetime: DbUtils.toValidDate(payload.fechaAutoDestruccion),
      programedCreationDatetime: DbUtils.toValidDate(payload.fechaHoraProgramacion),
      referenceCode: payload.mapeoFinalizacion?.codigoReferencia,
      referenceCode2: payload.mapeoFinalizacion?.codigoReferencia2
    });
    const targetPromises = [];
    payload.objetivos.codigosAreasObjetivos?.forEach(areaId => {
      targetPromises.push(
        this.bkAlertsRepository.createBkTarget({
          id: resCreationBkAlert.id,
          targetId: +areaId,
          targetType: BkTargetAlertType.AREA
        })
      );
    });
    payload.objetivos.codigosPerfilesObjectivos?.forEach(perfilId => {
      targetPromises.push(
        this.bkAlertsRepository.createBkTarget({
          id: resCreationBkAlert.id,
          targetId: +perfilId,
          targetType: BkTargetAlertType.PERFIL
        })
      );
    });
    payload.objetivos.codigosUsuariosObjetivos?.forEach(userId => {
      targetPromises.push(
        this.bkAlertsRepository.createBkTarget({
          id: resCreationBkAlert.id,
          targetId: +userId,
          targetType: BkTargetAlertType.USER
        })
      );
    });
    await Promise.all(targetPromises);
    const programationDatetime = new Date(payload.fechaHoraProgramacion);
    this.taskService.program(
      'scheduleAlert' + resCreationBkAlert.id,
      programationDatetime,
      async () => {
        await this.proccessAlert(payload);
        await this.bkAlertsRepository.markAlertCreation(resCreationBkAlert.id);
      }
    );
    return resCreationBkAlert;
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
  async finishAllAlertsByUserAndAlertType(userId: number, alertTypeId: number) {
    const alerts = await this.alertsRepository.getAlertForFinishByOriginUserAndAlertType(userId, alertTypeId);
    await Promise.allSettled(alerts.map(alert => {
      return this.httpService.post({
        path: 'notificacion-alerta/finalizacionAutomatica',
        data:{
          codigoAlerta: alert.CODIGO_ALERTA,
        }
      })
    }));
  }
}