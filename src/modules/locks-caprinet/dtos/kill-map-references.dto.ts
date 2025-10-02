import { ProgramLockCancelMap } from './program-lock.dto';

export class KillMapReferencesDto extends ProgramLockCancelMap {
  lockTypeId: number;
}