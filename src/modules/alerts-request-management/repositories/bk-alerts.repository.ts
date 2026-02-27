import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../../database/database.service";
import { AlertsSpDefaults } from "../../../database/sp/alerts.default";
import { IBkAlertsSpParams } from "../../../database/sp/interfaces/bk-alert-params.sp";
import { BkAlertsConditions } from "../../../database/sp/interfaces/enums/bk-alerts-conditions.enum";
import { ICreateBkAlertParams } from "../interfaces/create-bk-alert-params";
import { AlertsSp } from "../../../database/sp/enums/alerts.sp";
import { ICreatedDbResponse } from "../../../database/interface/created-db-response.interface";
import { ICreateBkTargetAlertParams } from "../interfaces/create-bk-target-alert-params";
import { IBkAlert } from "../interfaces/bk-alert";
import { IGetAllBkAlertsParams } from "../interfaces/get-all-bk-alerts-params";
import { DbUtils } from "../../../database/utils/db.utils";
import { BkTargetHelper } from "../helpers/bk-target.helper";

@Injectable()
export class BkAlertsRepository {
    constructor(
        private readonly db: DatabaseService
    ){}
    async getAll(params: IGetAllBkAlertsParams): Promise<IBkAlert[]> {
        const paramsArray = this.getFinalParams(params, BkAlertsConditions.LIST);
        const rows = await this.db.callProcedure(AlertsSp.BkCrud, paramsArray);
        const dataBkAlertsFormated = rows[0]?.map(DbUtils.normalizeRow) ?? [];
        const bkTargetFormated = rows[1]?.map(DbUtils.normalizeRow) ?? [];
        BkTargetHelper.mapTargetsOnAlertsBk(dataBkAlertsFormated, bkTargetFormated);
        return dataBkAlertsFormated;
    }
    async markAlertCreation(bkAlertId: number) {
        const paramsArray = this.getFinalParams({
            id: bkAlertId
        }, BkAlertsConditions.MARK_CREATION);
        await this.db.callProcedure(AlertsSp.BkCrud, paramsArray);
    }
    async createBkAlert(params: ICreateBkAlertParams): ICreatedDbResponse {
        const paramsArray = this.getFinalParams(params, BkAlertsConditions.INSERT_BK_ALERT);
        const rows = await this.db.callProcedure(AlertsSp.BkCrud, paramsArray);
        const id = rows[0][0].ULTIMO_ID as number;
        return {
            id
        };
    }
    async createBkTarget(params: ICreateBkTargetAlertParams): ICreatedDbResponse {
        const paramsArray = this.getFinalParams(params, BkAlertsConditions.INSERT_BK_TARGET);
        const rows = await this.db.callProcedure(AlertsSp.BkCrud, paramsArray);
        const id = rows[0][0].ULTIMO_ID as number;
        return {
            id
        };
    }
    private getFinalParams(params: Partial<IBkAlertsSpParams>, condition: BkAlertsConditions) {
        const final: IBkAlertsSpParams = {
            ...AlertsSpDefaults.bkCrud,
            ...params
        };
        const paramsArray = [
            condition,
            final.id,
            final.programedCreationDatetime,
            final.alertTypeId,
            final.userId,
            final.title,
            final.redirectionUrl,
            final.autoDestructionDatetime,
            final.jsonAlertBody,
            final.templateId,
            final.aditionalInformation,
            final.created,
            final.aborted,
            final.targetId,
            final.targetType,
            final.alertId,
            final.referenceCode,
            final.referenceCode2
        ];
        return paramsArray;
    } 
}