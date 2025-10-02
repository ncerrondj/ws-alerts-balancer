import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { IGetAllBkLocksCaprinet } from '../interfaces/get-all-bk-lock-caprinet-params';
import { BloqueosCaprinetSpDefaults } from '../../../database/sp/bloqueos-caprinet.default';
import { BkBloqueosCaprinetConditions, IBkBloqueosCaprinetSpParams } from '../../../database/sp/interfaces/bk-bloqueos-caprinet-params.sp';
import { BloqueosCaprinetSp } from '../../../database/sp/bloqueos-caprinet.sp';
import { IBkLockCaprinet } from '../interfaces/bk-lock-caprinet';
import { ICreateBkLockCaprinetParams } from '../interfaces/create-bk-lock-caprinet-params';
import { DbUtils } from '../../../database/utils/db.utils';
import { IAbortBkLockCaprinetParams } from '../interfaces/abort-bk-lock-params';
import { ReprogramLockDto } from '../dtos/reprogram-lock.dto';

@Injectable()
export class BkLocksCaprinetRepository {

  constructor(
    private readonly db: DatabaseService
  ){}

  async getAll(params: IGetAllBkLocksCaprinet): Promise<IBkLockCaprinet[]> {
    const paramsArray = this.getFinalParams(params, BkBloqueosCaprinetConditions.LIST);
    const rows = await this.db.callProcedure(BloqueosCaprinetSp.CrudBkBloqueos, paramsArray);
    return rows[0]?.map(DbUtils.normalizeRow) ?? [];
  }
  async create(params: ICreateBkLockCaprinetParams): Promise<{id: number}> {
    const paramsArray = this.getFinalParams(params, BkBloqueosCaprinetConditions.INSERT);
    const rows = await this.db.callProcedure(BloqueosCaprinetSp.CrudBkBloqueos, paramsArray);
    const id = rows[0][0].id as number;
    return {
      id,
    };
  }

  async lockCreated(id: number): Promise<void> {
    const paramsArray = this.getFinalParams({
      code: id
    }, BkBloqueosCaprinetConditions.LOCK_CREATED);
    await this.db.callProcedure(BloqueosCaprinetSp.CrudBkBloqueos, paramsArray);
  }
  async abort(params: IAbortBkLockCaprinetParams): Promise<void> {
    const paramsArray = this.getFinalParams({
      referenceCode: params.referenceCode,
      referenceCode2: params.referenceCode2,
      referenceCode3: params.referenceCode3
    }, BkBloqueosCaprinetConditions.ABORT);
    await this.db.callProcedure(BloqueosCaprinetSp.CrudBkBloqueos, paramsArray);
  }

  private getFinalParams(params: Partial<IBkBloqueosCaprinetSpParams>, condition: BkBloqueosCaprinetConditions) {
    const final: IBkBloqueosCaprinetSpParams = {
      ...BloqueosCaprinetSpDefaults.bkCrud,
      ...params
    };
    const paramsArray = [
      condition,
      final.code,
      final.codes,
      final.lockTypeId,
      final.originUserId,
      final.targetUserId,
      DbUtils.toValidDate(final.scheduledCreationDate),
      final.referenceCode,
      final.referenceCode2,
      final.referenceCode3,
      final.created,
      final.aborted
    ];
    return paramsArray;
  }
}