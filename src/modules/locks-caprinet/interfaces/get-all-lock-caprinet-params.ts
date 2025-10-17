import { IBloqueosCaprinetSpParams } from '../../../database/sp/interfaces/bloqueos-caprinet-params.sp';

export type IGetAllLocksCaprinet = Partial<Pick<IBloqueosCaprinetSpParams, 'lockTypeId' | 'targetUserId' | 'death' | 'scheduledCreationDate' | 'code'>>