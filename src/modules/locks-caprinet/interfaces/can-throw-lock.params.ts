import { ProgramLockDto } from "../dtos/program-lock.dto";

export interface ICanThrowLockParams {
    lockTypeId: number;
    data: ProgramLockDto
}