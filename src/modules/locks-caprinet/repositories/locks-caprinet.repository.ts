import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { BloqueosCaprinetSpDefaults } from '../../../database/sp/bloqueos-caprinet.default';
import { BloqueosCaprinetSp } from '../../../database/sp/bloqueos-caprinet.sp';
import { IGetAllLocksCaprinet } from '../interfaces/get-all-lock-caprinet-params';
import { ILockCaprinet } from '../interfaces/lock-caprinet';
import { BloqueosCaprinetConditions, IBloqueosCaprinetSpParams } from '../../../database/sp/interfaces/bloqueos-caprinet-params.sp';
import { ICreateLockCaprinetParams } from '../interfaces/create-lock-caprinet-params';
import { DbUtils } from '../../../database/utils/db.utils';
import { IReprogramLocks } from '../interfaces/reprogram-locks.params';

@Injectable()
export class LocksCaprinetRepository {

  constructor(
    private readonly db: DatabaseService
  ){}

  async getAll(params: IGetAllLocksCaprinet): Promise<ILockCaprinet[]> {
    const paramsArray = this.getFinalParams(params, BloqueosCaprinetConditions.LIST);
    const rows = await this.db.callProcedure(BloqueosCaprinetSp.CrudBloqueos, paramsArray);
    return rows[0]?.map(DbUtils.normalizeRow) ?? [];
  }
  
  async getActivesByUserId(targetUserId: number): Promise<{CODIGO_TIPO_BLOQUEO: number}> {
    const paramsArray = this.getFinalParams({targetUserId}, BloqueosCaprinetConditions.GET_ACTIVES_BY_USER_ID);
    const rows = await this.db.callProcedure(BloqueosCaprinetSp.CrudBloqueos, paramsArray);
    return rows[0]?.map(DbUtils.normalizeRow) ?? [];
  }

  async create(params: ICreateLockCaprinetParams): Promise<{id: number}> {
    params.scheduledCreationDate = DbUtils.toValidDate(params.scheduledCreationDate)
    const paramsArray = this.getFinalParams(params, BloqueosCaprinetConditions.INSERT);
    const rows = await this.db.callProcedure(BloqueosCaprinetSp.CrudBloqueos, paramsArray);
    const id = rows[0][0].id as number;
    return {
      id,
    };
  }
  async killById(id: number): Promise<void> {
    const paramsArray = this.getFinalParams({
      code: id
    }, BloqueosCaprinetConditions.KILL);
    await this.db.callProcedure(BloqueosCaprinetSp.CrudBloqueos, paramsArray);
  }
  async reprogramLocksByTypeAndTargetUser(params: IReprogramLocks) {
    const paramsArray = this.getFinalParams(params, BloqueosCaprinetConditions.RESCHEDULE);
    const rows =  await this.db.callProcedure(BloqueosCaprinetSp.CrudBloqueos, paramsArray);
    const newBkCodesForReprogramations = rows[0][0].CODIGOS_BK_CREADOS as string;
    return {
      newBkCodesForReprogramations
    };
  }
  private getFinalParams(params: Partial<IBloqueosCaprinetSpParams>, condition: BloqueosCaprinetConditions) {
    const final: IBloqueosCaprinetSpParams = {
      ...BloqueosCaprinetSpDefaults.crud,
      ...params
    };
    const paramsArray = [
      condition,
      final.code,
      final.lockTypeId,
      final.bkLockId,
      final.originUserId,
      final.targetUserId,
      final.scheduledCreationDate,
      final.death,
      DbUtils.toValidDate(final.reschedulingDatetime)
    ];
    return paramsArray;
  }
}