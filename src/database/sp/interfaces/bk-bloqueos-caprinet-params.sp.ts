export enum BkBloqueosCaprinetConditions {
  INSERT = 'I',
  LIST = 'L',
  LOCK_CREATED = 'C',
  ABORT = 'A'
} 
export interface IBkBloqueosCaprinetSpParams {
  condition: BkBloqueosCaprinetConditions;
  code: number;
  codes: string;
  lockTypeId: number;
  originUserId: number;
  targetUserId: number;
  scheduledCreationDate: string;
  referenceCode: string;
  referenceCode2: string;
  referenceCode3: string;
  created: boolean;
  aborted: boolean;
}