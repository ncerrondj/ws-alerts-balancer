import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { BloqueosCaprinetSpDefaults } from '../../../database/sp/bloqueos-caprinet.default';
import { BloqueosCaprinetSp } from '../../../database/sp/bloqueos-caprinet.sp';
import { IGetAllLockExistenceMapping } from '../interfaces/get-all-lock-existence-mapping-params';
import { ILockExistenceMapping } from '../interfaces/lock-existence-mapping';
import { ILockExistenceMappingSpParams, LockExistenceMappingConditions } from '../../../database/sp/interfaces/lock-existences-mapping-params.sp';
import { ICreateLockExistenceMappingParams } from '../interfaces/create-lock-existence-mapping-params';
import { DbUtils } from '../../../database/utils/db.utils';
import { IKillAndGetLockExistenceMapping } from '../interfaces/kill-and-get-lock-existence-mapping-params';

@Injectable()
export class LocksExistenceMappingRepository {

  private readonly mainSp = BloqueosCaprinetSp.CrudMapeos;

  constructor(
    private readonly db: DatabaseService
  ){}

  async getAll(params: IGetAllLockExistenceMapping): Promise<ILockExistenceMapping[]> {
    const paramsArray = this.getFinalParams(params, LockExistenceMappingConditions.LIST);
    const rows = await this.db.callProcedure(this.mainSp, paramsArray);
    return rows[0]?.map(DbUtils.normalizeRow) ?? [];
  }
  async getById(id: number): Promise<ILockExistenceMapping> {
    const rows = await this.getAll({
      code: id,
    });
    return rows[0];
  }
  async create(params: ICreateLockExistenceMappingParams): Promise<{id: number}> {
    params.deathMapping ??= false;
    const paramsArray = this.getFinalParams(params, LockExistenceMappingConditions.INSERT);
    const rows = await this.db.callProcedure(this.mainSp, paramsArray);
    const id = rows[0][0].id as number;
    return {
      id,
    };
  }
  async killById(id: number): Promise<void> {
    const paramsArray = this.getFinalParams({code: id }, LockExistenceMappingConditions.KILL);
    await this.db.callProcedure(this.mainSp, paramsArray);
  }
  async killAndGet(params: IKillAndGetLockExistenceMapping) {
    const paramsArray = this.getFinalParams(params, LockExistenceMappingConditions.KILL_AND_GET);
    const rows = await this.db.callProcedure(this.mainSp, paramsArray);
    return rows[0]?.map(DbUtils.normalizeRow) ?? [];
  }
  private getFinalParams(params: Partial<IGetAllLockExistenceMapping>, condition: LockExistenceMappingConditions) {
    const final: ILockExistenceMappingSpParams = {
      ...BloqueosCaprinetSpDefaults.existencesMapping,
      ...params
    };
    const paramsArray = [
      condition,
      final.code,
      final.lockId,
      final.lockTypeId,
      final.referenceCode,
      final.referenceCode2,
      final.referenceCode3,
      final.deathMapping,
      final.targetUserId,
    ];
    return paramsArray;
  }
}