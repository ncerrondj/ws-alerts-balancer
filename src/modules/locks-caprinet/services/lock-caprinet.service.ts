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

@Injectable()
export class LockCaprinetService implements OnModuleInit {
  
  private readonly logger = new Logger(LockCaprinetService.name);
  constructor(
    private readonly bkLockCaprinetRepository: BkLocksCaprinetRepository,
    private readonly taskService: TaskService,
    private readonly locksExistenceMappingRepository: LocksExistenceMappingRepository,
    private readonly locksCaprinetRepository: LocksCaprinetRepository,
    private readonly wsAlertsConnectionsService: WsAlertsConnectionsService,
    private readonly incidentsRepository: IncidentRepository,
    private readonly locksPostponementManagerService: LocksPostponementManagerService
  ) {}
  async onModuleInit() {
    const bks = await this.bkLockCaprinetRepository.getAll({
      created: false,
      aborted: false,
    });
    console.log({bks});
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
          this.locksCaprinetRepository.killById(map.CODIGO_BLOQUEO),
        );
      }
      await Promise.all(promises);
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
      referenceCode3: data.referenceCode3
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
}
