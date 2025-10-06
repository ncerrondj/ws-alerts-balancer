export class ReprogramLockDto {
    lockTypeId: number;
    //2025-09-29 20:02:00
    reschedulingDatetime: string;
    unlockUserId: number;
    userId: number;
}
export class ReprogramLockByMapDto {
    lockTypeId: number;
    reschedulingDatetime: string;
    referenceCode: string;
    referenceCode2: string;
    referenceCode3: string;
    userId: number;
}