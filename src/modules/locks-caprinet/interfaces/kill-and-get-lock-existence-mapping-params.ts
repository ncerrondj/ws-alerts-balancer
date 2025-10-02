import { ILockExistenceMappingSpParams } from '../../../database/sp/interfaces/lock-existences-mapping-params.sp';

export type IKillAndGetLockExistenceMapping = Partial<Pick<ILockExistenceMappingSpParams, 'lockTypeId' | 'referenceCode' | 'referenceCode2' | 'referenceCode3'>>