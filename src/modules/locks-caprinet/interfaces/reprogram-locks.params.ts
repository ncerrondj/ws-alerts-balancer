import { IBloqueosCaprinetSpParams } from '../../../database/sp/interfaces/bloqueos-caprinet-params.sp';

export type IReprogramLocks = Partial<Pick<IBloqueosCaprinetSpParams, 'lockTypeId' | 'reschedulingDatetime' | 'targetUserId'>>;