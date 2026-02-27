import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { BkLocksCaprinetRepository } from '../repositories/bk-locks-caprinet.repository';
import { TaskService } from '../../../modules/tasks/services/task.service';
import { LocksExistenceMappingRepository } from '../repositories/locks-existence-mapping.repository';
import { ProgramLockDto } from '../dtos/program-lock.dto';
import { LocksCaprinetRepository } from '../repositories/locks-caprinet.repository';
import { KillMapReferencesDto } from '../dtos/kill-map-references.dto';
import { WsAlertsConnectionsService } from '../../../modules/alerts-request-management/services/ws-alerts-connections.service';
import { LOCK_ACTION } from '../enums/lock-action.enum';
import { GetLocksDto } from '../dtos/get-locks.dto';
import { NotifyLocksCloseDto } from '../dtos/notify-locks-close.dto';
import { ReprogramLockByMapDto, ReprogramLockDto } from '../dtos/reprogram-lock.dto';
import { IncidentRepository } from '../../../modules/incidents/repositories/incidents.repository';
import { DbUtils } from '../../../database/utils/db.utils';
import { TIMES_MILLISECONDS } from '../../../utils/times.util';
import { LocksPostponementManagerService } from './locks-postponement-manager.service';
import { AlertNotificationService } from '../../../modules/alerts-request-management/services/alert-notifications.service';

@Injectable()
export class LockCaprinetService implements OnModuleInit {
  
  private readonly logger = new Logger(LockCaprinetService.name);
  private readonly lockAlertTypeId = 24;
  constructor(
    private readonly bkLockCaprinetRepository: BkLocksCaprinetRepository,
    private readonly taskService: TaskService,
    private readonly locksExistenceMappingRepository: LocksExistenceMappingRepository,
    private readonly locksCaprinetRepository: LocksCaprinetRepository,
    private readonly wsAlertsConnectionsService: WsAlertsConnectionsService,
    private readonly incidentsRepository: IncidentRepository,
    private readonly locksPostponementManagerService: LocksPostponementManagerService,
    private readonly alertNotificationService: AlertNotificationService
  ) {}
  // async matarSolicitudDeDesbloqueoInecesarios() {
  //   const usuarios = [
  //     1,3,4,722,7,8,10,11,12,13,15,16,46,45,44,43,42,48,49,52,58,62,67,71,72,74,75,80,81,84,86,89,90,92,93,94,95,97,99,100,102,105,108,110,111,113,115,117,118,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,138,139,140,141,142,147,148,149,153,154,157,164,168,169,170,172,173,174,175,176,179,181,184,185,186,187,189,190,191,192,195,196,199,202,203,204,207,209,210,212,215,221,222,229,235,236,244,246,248,249,252,254,256,257,258,259,261,263,264,265,266,267,269,272,275,279,280,281,283,284,289,296,297,298,299,301,302,316,330,331,332,333,334,337,338,339,340,341,342,343,345,350,351,352,353,363,364,365,366,367,368,369,371,373,375,377,378,379,380,382,383,384,385,387,389,390,391,392,393,397,398,399,400,406,407,412,415,416,419,420,421,422,423,424,425,426,428,429,430,431,432,434,435,436,437,438,439,440,451,446,449,450,452,453,454,455,456,457,458,459,460,461,462,463,465,466,475,479,484,485,486,489,498,499,504,505,509,511,512,513,516,517,518,520,521,522,523,524,525,526,527,529,531,533,535,536,537,539,540,541,542,543,545,546,547,548,549,550,551,552,553,554,555,556,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,575,576,577,578,579,580,581,582,583,584,585,586,587,588,589,590,592,593,594,595,596,597,598,599,600,601,603,604,605,606,607,608,610,611,612,613,614,617,621,622,623,624,625,626,627,628,629,630,631,633,634,635,636,638,640,641,642,643,644,656,658,660,662,668,669,670,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,689,691,692,693,694,695,696,697,698,700,701,704,705,707,708,710,712,713,714,715,716,718,719,720,721,726,728,729,730,732,733,734,739,740,741,743,744,747,748,749,750,752,753,754,755,756,757,758,759,768,760,762,763,764,765,766,769,772,773,774,775,777,778,779,780,781,782,783,784,785,786,787,788,789,791,792,793,794,796,797,798,799,800,801,802,804,805,806,807,808,810,811,813,815,816,817,819,820,822,823,824,825,826,827,828,829,830,832,834,835,837,838,839,840,841,842,843,844,845,846,847,848,849,850,851,852,853,854,855,856,857,858,859,860,861,862,863,864,865,866,867,868,869,870,871,872,873,874,875,876,882,881,880,883,884,885,886,887,888,889,890,891,892,893,894,896,897,898,899,900,901,902,903,904,905,906,907,908,909,910,911,912,913,914,915,916,917,918,919,920,921,922,923,924,925,926,927,928,929,930,931,932,933,934,935,936,937,938,939,940,941,942,943,944,945,946,947,948,949];
  //   for (const userId of usuarios) {
  //       const alerts = await this.getActivesByUserTargetId(userId);
  //       alerts.length && console.log({alertsLength: alerts.length, userId});
  //       if(!alerts.length) {
  //         await this.alertNotificationService.finishAllAlertsByUserAndAlertType(userId, this.lockAlertTypeId);  
  //       }
  //   }
  // }
  async onModuleInit() {
    return;
    const bks = await this.bkLockCaprinetRepository.getAll({
      created: false,
      aborted: false,
    });
    bks.forEach((bk) => {
      this.programLock(
        {
          lockTypeId: bk.CODIGO_TIPO_BLOQUEO,
          originUserId: bk.CODIGO_USUARIO_ORIGEN,
          targetUserId: bk.CODIGO_USUARIO_DESTINO,
          scheduledCreationDate: new Date(bk.FECHA_CREACION_PROGRAMADA.replace(' ', 'T').concat('-05:00')).toJSON(),
          cancelMap: {
            referenceCode: bk.CODIGO_REFERENCIA,
            referenceCode2: bk.CODIGO_REFERENCIA_2,
            referenceCode3: bk.CODIGO_REFERENCIA_3,
          },
        },
        bk.CODIGO,
      );
      this.logger.warn(`Tarea con id '${bk.CODIGO}' programada desde el bk`);
    });
  }

  async programLock(data: ProgramLockDto, bkLockId?: number) {
    const { lockTypeId, cancelMap } = data;
    if (!bkLockId) {
      bkLockId = (
        await this.bkLockCaprinetRepository.create({
          lockTypeId,
          originUserId: data.originUserId,
          targetUserId: data.targetUserId,
          scheduledCreationDate: data.scheduledCreationDate,
          referenceCode: cancelMap.referenceCode,
          referenceCode2: cancelMap.referenceCode2,
          referenceCode3: cancelMap.referenceCode3,
        })
      ).id;
    }
    const resMap = await this.locksExistenceMappingRepository.create({
      lockTypeId,
      referenceCode: cancelMap.referenceCode,
      referenceCode2: cancelMap.referenceCode2,
      referenceCode3: cancelMap.referenceCode3,
    });
    let scheduledCreationDate = new Date(data.scheduledCreationDate);
    const now = new Date();
    if (scheduledCreationDate <= now) {
      now.setMilliseconds(now.getMilliseconds() + 5000);
      scheduledCreationDate = now;
    }

    this.taskService.program(
      bkLockId.toString(),
      scheduledCreationDate,
      async () => {
        this.throwLockHandle(bkLockId, data);
      },
    );
    return bkLockId;
  }

  async throwLockHandle(bkLockId: number, data: ProgramLockDto) {
    const { lockTypeId, cancelMap } = data;
    const bk = await this.bkLockCaprinetRepository.getById(bkLockId);
    if (!bk || bk?.ABORTADO) return;
    const deathExistences = await this.locksExistenceMappingRepository.getAll({
      lockTypeId,
      referenceCode: cancelMap.referenceCode,
      referenceCode2: cancelMap.referenceCode2,
      referenceCode3: cancelMap.referenceCode3,
      deathMapping: true,
    });
    if (deathExistences.length) return;
    await this.thorwLock(bkLockId, data);
  }

  async thorwLock(bkLockId: number, data: ProgramLockDto) {
    //agregar codigo bloqueo opcional al mapping
    const canThrowLock = await this.locksPostponementManagerService.canThrowLock({
      lockTypeId: data.lockTypeId,
      data
    });
    if (!canThrowLock) {
      this.postponeLock(bkLockId, data);
      return;
    }
    const { cancelMap, lockTypeId } = data;
    const res = await this.locksCaprinetRepository.create({
      bkLockId,
      lockTypeId,
      originUserId: data.originUserId,
      targetUserId: data.targetUserId,
      scheduledCreationDate: data.scheduledCreationDate,
    });
    const lockId = res.id;
    await this.bkLockCaprinetRepository.lockCreated(bkLockId);
    await this.locksExistenceMappingRepository.create({
      lockTypeId,
      referenceCode: cancelMap.referenceCode,
      referenceCode2: cancelMap.referenceCode2,
      referenceCode3: cancelMap.referenceCode3,
      lockId,
    });
    const targetUserId = data.targetUserId.toString();

    const connections =
      this.wsAlertsConnectionsService.getConnections(targetUserId);

    connections.forEach((client) => {
      client.emit(LOCK_ACTION.THROW_LOCK_TO_USER.concat(targetUserId), data);
    });
  }
  async postponeLock(bkLockId: number, data: ProgramLockDto) {
    const newScheduleTime = new Date();
    const millisecondsToAdd = TIMES_MILLISECONDS.ONE_DAY;
    newScheduleTime.setTime(newScheduleTime.getTime() + millisecondsToAdd);
    const newScheduleTimeJson = newScheduleTime.toJSON();
    data.scheduledCreationDate = newScheduleTimeJson;
    await this.bkLockCaprinetRepository.postpone({
      id: bkLockId,
      datetime: newScheduleTimeJson
    });
    this.taskService.program(
      bkLockId.toString(),
      newScheduleTime,
      async () => {
        this.throwLockHandle(bkLockId, data);
      },
    );
    this.logger.warn(`Tarea con id ${bkLockId} pospuesta para ${newScheduleTime.toLocaleString('es-PE', { timeZone: 'America/Lima' })}`);
    this.logger.warn(JSON.stringify(data, null, 2));
  }
  async killMapReferences(data: KillMapReferencesDto) {
    const { lockTypeId, referenceCode, referenceCode2, referenceCode3 } = data;
    await this.bkLockCaprinetRepository.abort(data);
    const existencesMapping =
      await this.locksExistenceMappingRepository.killAndGet({
        lockTypeId,
        referenceCode,
        referenceCode2,
        referenceCode3,
      });
    if (!existencesMapping.length) {
      await this.locksExistenceMappingRepository.create({
        lockTypeId,
        referenceCode: referenceCode,
        referenceCode2: referenceCode2,
        referenceCode3: referenceCode3,
        deathMapping: true,
      });
    } else {
      const promises = [];
      for (const map of existencesMapping.filter((e) => e.CODIGO_BLOQUEO)) {
        promises.push(
          //this.locksCaprinetRepository.killById(map.CODIGO_BLOQUEO),
          this.killLockById(map.CODIGO_BLOQUEO)
        );
      }
      await Promise.allSettled(promises);
    }
    return { success: true };
  }
  async getActivesByUserTargetId(userTargetId: number) {
    return await this.locksCaprinetRepository.getActivesByUserId(userTargetId);
  }
  async getLocks(query: GetLocksDto) {
    const { death, ...params } = query;
    const deathParams = death === '' ? null : death === '1';
    const data = await this.locksCaprinetRepository.getAll({
      ...params,
      death: deathParams,
    });
    return {
      total: data.length,
      data,
    };
  }
  async reprogram(data: ReprogramLockDto) {
    const {newBkCodesForReprogramations} = await this.locksCaprinetRepository.reprogramLocksByTypeAndTargetUser({
      lockTypeId: data.lockTypeId,
      reschedulingDatetime: data.reschedulingDatetime,
      targetUserId: data.unlockUserId,
      userId: data.userId
    });
    await this.reprogramByBkCodes(newBkCodesForReprogramations);
    const reschedulingDatetime = new Date(data.reschedulingDatetime);
    const now = new Date();

    if (reschedulingDatetime >= now) {
      this.wsAlertsConnectionsService.getConnections(data.unlockUserId.toString()).forEach(c => {
        c.emit(LOCK_ACTION.UNLOCK_TO_USER.concat(data.unlockUserId.toString()), {lockTypeId: data.lockTypeId});
      });
    }
    return { success: true };
  }
  private async reprogramByBkCodes(codes: string) {
    const bks = await this.bkLockCaprinetRepository.getAll({
      codes
    });
    bks.forEach(bk => {
      this.programLock({
        lockTypeId: bk.CODIGO_TIPO_BLOQUEO,
        originUserId: bk.CODIGO_USUARIO_ORIGEN,
        targetUserId: bk.CODIGO_USUARIO_DESTINO,
        scheduledCreationDate: DbUtils.toJsonDate(bk.FECHA_CREACION_PROGRAMADA),
        cancelMap: {
          referenceCode: bk.CODIGO_REFERENCIA,
          referenceCode2: bk.CODIGO_REFERENCIA_2,
          referenceCode3: bk.CODIGO_REFERENCIA_3
        }
      }, bk.CODIGO);
    });
    return bks;
  }
  async reprogramByMap(data: ReprogramLockByMapDto) {
    const {newBkCodesForReprogramations, abortedBkCodes} = await this.locksCaprinetRepository.reprogramLockByMap({
      lockTypeId: data.lockTypeId,
      reschedulingDatetime: data.reschedulingDatetime,
      referenceCode: data.referenceCode,
      referenceCode2: data.referenceCode2,
      referenceCode3: data.referenceCode3,
      userId: data.userId,
    });
    await this.reprogramByBkCodes(newBkCodesForReprogramations);
    abortedBkCodes.split(',').forEach(bkCode => {
      this.taskService.cancel(bkCode);
    });
    return {success:true};
  }
  async notifyLocksClose(data: NotifyLocksCloseDto) {
    const connections = this.wsAlertsConnectionsService.getConnections(
      data.userId,
    );
    connections.forEach((c) => {
      c.emit(LOCK_ACTION.NOFITY_LOCKS_CLOSE_TO_USER.concat(data.userId), data);
    });
    return { success: true };
  }
  async cancelLock(bkId: number) {
    this.taskService.cancel(bkId.toString());
    await this.bkLockCaprinetRepository.cancelById(bkId);
    return {
      success: true
    };
  }
  private async killLockById(lockId: number) {
    const lock = await this.locksCaprinetRepository.getById(lockId);
    if(!lock) return;
    await this.locksCaprinetRepository.killById(lockId);
    const actives = await this.getActivesByUserTargetId(lock.CODIGO_USUARIO_DESTINO);
    //quiere decir q este bloqueo fue el ultimo del tipo
    if (actives.every(active => active.CODIGO_TIPO_BLOQUEO != lock.CODIGO_TIPO_BLOQUEO)) {
      const codigoUsuarioDestino = lock.CODIGO_USUARIO_DESTINO.toString();
      this.wsAlertsConnectionsService.getConnections(codigoUsuarioDestino).forEach(c => {
        c.emit(LOCK_ACTION.UNLOCK_TO_USER.concat(codigoUsuarioDestino), {lockTypeId: lock.CODIGO_TIPO_BLOQUEO});
      })
    }
    if(!actives.length) {
      await this.alertNotificationService.finishAllAlertsByUserAndAlertType(lock.CODIGO_USUARIO_DESTINO, this.lockAlertTypeId);
    }
  }
}
