import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../../database/database.service";
import { AlertConfigSpDefaults } from "../../../database/sp/alert-config.default";
import { AlertNotificationConfigConditions, IAlertNotificationConfigSpParams } from "../../../database/sp/interfaces/alert-notification-config-params.sp";
import { IUpdateAlertConfigParams } from "../interfaces/update-alert-config-params";
import { AlertConfigSp } from "../../../database/sp/alert-config.sp";

@Injectable()
export class AlertNotificationConfigRepository {
    constructor(
    private readonly db: DatabaseService
    ){}
    async updateGeneralConfig(data: IUpdateAlertConfigParams) {
        const paramsArray = this.getFinalParams(data, AlertNotificationConfigConditions.UPDATE);
        await this.db.callProcedure(AlertConfigSp.CrudAlertConfig, paramsArray);
    }
    private getFinalParams(params: Partial<IAlertNotificationConfigSpParams>, condition: AlertNotificationConfigConditions) {
        const final:IAlertNotificationConfigSpParams  = {
            ...AlertConfigSpDefaults.crud,
            ...params
        };
        const paramsArray = [
            condition,
            final.userId,
            final.alertTypeId,
            final.intermittentSound,
            final.notificationSound,
            final.generalSound
        ];
        return paramsArray;
    }
}