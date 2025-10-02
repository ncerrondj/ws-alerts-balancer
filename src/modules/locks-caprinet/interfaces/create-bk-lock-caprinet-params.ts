import { IBkBloqueosCaprinetSpParams } from '../../../database/sp/interfaces/bk-bloqueos-caprinet-params.sp';

export type ICreateBkLockCaprinetParams = Pick<IBkBloqueosCaprinetSpParams, 'lockTypeId' | 'targetUserId' | 'originUserId' | 'scheduledCreationDate' | 'referenceCode' | 'referenceCode2' | 'referenceCode3'>;