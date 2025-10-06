import { IBloqueosCaprinetSpParams } from '../../../database/sp/interfaces/bloqueos-caprinet-params.sp';

export type IReprogramLocks = Partial<Pick<IBloqueosCaprinetSpParams, 'lockTypeId' | 'reschedulingDatetime' | 'targetUserId' | 'referenceCode' | 'referenceCode2' | 'referenceCode3' | 'userId'>>;
export type IReprogramLocksByMap = Partial<Pick<IBloqueosCaprinetSpParams, 'lockTypeId' | 'reschedulingDatetime'| 'referenceCode' | 'referenceCode2' | 'referenceCode3' | 'userId'>>;