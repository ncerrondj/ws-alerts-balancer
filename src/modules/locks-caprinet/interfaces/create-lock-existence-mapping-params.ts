import { ILockExistenceMappingSpParams } from '../../../database/sp/interfaces/lock-existences-mapping-params.sp';

export type ICreateLockExistenceMappingParams = Pick<ILockExistenceMappingSpParams, | 'lockTypeId' | 'referenceCode' | 'referenceCode2' | 'referenceCode3' | 'lockId' | 'deathMapping'>;