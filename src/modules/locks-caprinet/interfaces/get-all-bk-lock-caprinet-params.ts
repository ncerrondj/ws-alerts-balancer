import { IBkBloqueosCaprinetSpParams } from '../../../database/sp/interfaces/bk-bloqueos-caprinet-params.sp';

export type IGetAllBkLocksCaprinet = Partial<Pick<IBkBloqueosCaprinetSpParams, 'lockTypeId' | 'targetUserId' | 'originUserId' | 'scheduledCreationDate' | 'created' | 'aborted' | 'codes' | 'code'>>