import { ILockExistenceMappingSpParams } from '../../../database/sp/interfaces/lock-existences-mapping-params.sp';

export type IGetAllLockExistenceMapping = Partial<Pick<ILockExistenceMappingSpParams, 'code' | 'lockTypeId' | 'referenceCode' | 'referenceCode2' | 'referenceCode3' | 'deathMapping' | 'targetUserId'>>