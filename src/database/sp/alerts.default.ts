import { IAlertsSpParams } from "./interfaces/alerts-params.sp";

export class AlertsSpDefaults {
    static readonly crud: IAlertsSpParams = {
        condition: null,
        txtAlertIds: null,
        alertId: null,
        alertTypeId: null,
        templateId: null,
        receptionId: null,
        originUserId: null,
        title: null,
        aditionalInformation: null,
        redirectionURL: null,
        jsonBody: null,
        receptorUserId: null,
        autoDestructionDate: null,
        txtAreaIds: null,
        txtPerfilIds: null,
        txtUserIds: null,
        jsonKeysFilter: null,
        textFilter: null,
        getAllAlertIds: null,
        pageSize: null,
        codigoRepecionAlertaCursor: null,
    }
}