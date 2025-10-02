export class ProgramLockCancelMap {
  referenceCode: string;
  referenceCode2: string;
  referenceCode3: string;
}
export class ProgramLockDto {
  lockTypeId: number;
  originUserId: number;
  targetUserId: number;
  scheduledCreationDate: string;
  cancelMap: ProgramLockCancelMap;
}