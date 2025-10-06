import { IBkBloqueosCaprinetSpParams } from './interfaces/bk-bloqueos-caprinet-params.sp';
import { IBloqueosCaprinetSpParams } from './interfaces/bloqueos-caprinet-params.sp';
import { ILockExistenceMappingSpParams } from './interfaces/lock-existences-mapping-params.sp';

export class BloqueosCaprinetSpDefaults {
  static readonly bkCrud: IBkBloqueosCaprinetSpParams = {
    condition: null,
    code: null,
    codes: null,
    lockTypeId: null,
    originUserId: null,
    created: null,
    scheduledCreationDate: null,
    referenceCode: null,
    referenceCode2: null,
    referenceCode3: null,
    targetUserId: null,
    aborted: null,  
  };
  static readonly existencesMapping: ILockExistenceMappingSpParams = {
    condition: null,
    code: null,
    lockId: null,
    lockTypeId: null,
    referenceCode: null,
    referenceCode2: null,
    referenceCode3: null,
    deathMapping: null,
    targetUserId: null
  };
  static readonly crud: IBloqueosCaprinetSpParams = {
    condition: null,
    code: null,
    bkLockId: null,
    lockTypeId: null,
    originUserId: null,
    targetUserId: null,
    scheduledCreationDate: null,
    death: null,
    reschedulingDatetime: null,
    referenceCode: null,
    referenceCode2: null,
    referenceCode3: null,
    userId: null
  };
}