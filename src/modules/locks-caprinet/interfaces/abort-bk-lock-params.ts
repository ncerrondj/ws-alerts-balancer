import { IBkBloqueosCaprinetSpParams } from '../../../database/sp/interfaces/bk-bloqueos-caprinet-params.sp';

export type IAbortBkLockCaprinetParams = Pick<IBkBloqueosCaprinetSpParams, 'referenceCode' | 'referenceCode2' | 'referenceCode3' | 'lockTypeId'>;