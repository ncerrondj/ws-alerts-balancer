import { PopUpMappingCrudConditions } from "./enums/pop-up-mapping-conditions.enum"

export interface IPopUpMappingSpParams {
    condition: PopUpMappingCrudConditions;
    codes: string;
    notificationId: number;
    chrNotificationType: string;
    notificationSubTypeId: number;
    referenceCode: string;
    referenceCode2: string;
    referenceCode3: string;
    finisherUserId: number;
    deathMapping: boolean;
}