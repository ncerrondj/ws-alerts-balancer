export enum LockExistenceMappingConditions {
  INSERT = 'I',
  LIST = 'L',
  KILL = 'K',
  KILL_AND_GET = 'T'
} 
export interface ILockExistenceMappingSpParams {
  condition: LockExistenceMappingConditions;
  code: number;
  lockId?: number;
  lockTypeId: number;
  referenceCode: string;
  referenceCode2: string;
  referenceCode3: string;
  deathMapping?: boolean;
  targetUserId?: number;
}