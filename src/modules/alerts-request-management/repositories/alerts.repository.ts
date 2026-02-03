import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../../database/database.service";
import { AlertsSpDefaults } from "../../../database/sp/alerts.default";
import { AlertsSp } from "../../../database/sp/enums/alerts.sp";
import { IAlertsSpParams } from "../../../database/sp/interfaces/alerts-params.sp";
import { AlertsCrudConditions } from "../../../database/sp/interfaces/enums/alerts-conditions.enum";
import { BaseAlert } from "../model/base-alert";
import { DbUtils } from "../../../database/utils/db.utils";

@Injectable()
export class AlertsRepository {
    constructor(
        private readonly db: DatabaseService
    ){}
    async getAlertForFinishByOriginUserAndAlertType(originUserId: number, alertTypeId: number): Promise<BaseAlert<any>[]> {
        const paramsArray = this.getFinalParams({
            originUserId,
            alertTypeId
        }, AlertsCrudConditions.FINISH_BY_TYPE_AND_ORIGIN_USER);
        const rows = await this.db.callProcedure(AlertsSp.Crud, paramsArray);
        return rows[0]?.map(DbUtils.normalizeRow) ?? [];
    }
    private getFinalParams(params: Partial<IAlertsSpParams>, condition: AlertsCrudConditions) {
        const final: IAlertsSpParams = {
            ...AlertsSpDefaults.crud,
            ...params
        };
        const paramsArray = [
            condition,
            final.txtAlertIds,
            final.alertId,
            final.alertTypeId,
            final.templateId,
            final.receptionId,
            final.originUserId,
            final.title,
            final.aditionalInformation,
            final.redirectionURL,
            final.jsonBody,
            final.receptorUserId,
            final.autoDestructionDate,
            final.txtAreaIds,
            final.txtPerfilIds,
            final.txtUserIds,
            final.jsonKeysFilter,
            final.textFilter,
            final.getAllAlertIds,
            final.pageSize,
            final.codigoRepecionAlertaCursor
        ];
        return paramsArray;
    } 
}