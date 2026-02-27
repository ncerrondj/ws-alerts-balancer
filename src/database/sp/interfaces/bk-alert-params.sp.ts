import { BkAlertsConditions } from "./enums/bk-alerts-conditions.enum";
export enum BkTargetAlertType {
    AREA = 'AREA',
    PERFIL = 'PERFIL',
    USER = 'USUARIO'
}
export interface IBkAlertsSpParams {
    condition: BkAlertsConditions;
    id: number;
    programedCreationDatetime: string;
    alertTypeId: number
    userId: number;
    title: string;
    redirectionUrl: string;
    autoDestructionDatetime: string;
    jsonAlertBody: string;
    templateId: number;
    aditionalInformation: string;
    created: boolean;
    aborted: boolean;
    targetType: BkTargetAlertType;
    targetId: number;
    alertId: number;
    referenceCode: string;
    referenceCode2: string;
}
