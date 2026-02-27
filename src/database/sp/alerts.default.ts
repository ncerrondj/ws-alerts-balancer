import { IAlertsSpParams } from "./interfaces/alerts-params.sp";
import { IBkAlertsSpParams } from "./interfaces/bk-alert-params.sp";

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
    static readonly bkCrud: IBkAlertsSpParams = {
        condition: null,
        id: null,
        programedCreationDatetime: null,
        alertTypeId: null,
        userId: null,
        title: null,
        redirectionUrl: null,
        autoDestructionDatetime: null,
        jsonAlertBody: null,
        templateId: null,
        aditionalInformation: null,
        created: null,
        aborted: null,
        targetId: null,
        targetType: null,
        alertId: null,
        referenceCode: null,
        referenceCode2: null,
    }
}