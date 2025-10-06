export enum BloqueosCaprinetConditions {
  INSERT = 'I',
  LIST = 'L',
  KILL = 'K',
  GET_ACTIVES_BY_USER_ID = 'A',
  RESCHEDULE = 'R',
  RESCHEDULE_BY_MAP = 'P'
} 
export interface IBloqueosCaprinetSpParams {
  condition: BloqueosCaprinetConditions;
  code: number;
  lockTypeId: number;
  bkLockId: number;
  originUserId: number;
  targetUserId: number;
  scheduledCreationDate: string;
  reschedulingDatetime: string;
  death: boolean;
  referenceCode: string;
  referenceCode2: string;
  referenceCode3: string;
  userId: number;
}