import { IBloqueosCaprinetSpParams } from '../../../database/sp/interfaces/bloqueos-caprinet-params.sp';

export type ICreateLockCaprinetParams = Pick<IBloqueosCaprinetSpParams, 'lockTypeId' | 'targetUserId' | 'originUserId' | 'scheduledCreationDate' | 'bkLockId'>;