import { AlertsCrudConditions } from "./enums/alerts-conditions.enum";

export interface IAlertsSpParams {
    condition: AlertsCrudConditions;
    txtAlertIds: string;
    alertId: number;
    alertTypeId: number;
    templateId: number;
    receptionId: number;
    originUserId: number;
    title: number;
    aditionalInformation: string;
    redirectionURL: string;
    jsonBody: string;
    receptorUserId: number;
    autoDestructionDate: string;
    txtAreaIds: string;
    txtPerfilIds: string;
    txtUserIds: string;
    jsonKeysFilter: string;
    textFilter: string;
    getAllAlertIds: string;
    pageSize: number;
    codigoRepecionAlertaCursor: number;
}