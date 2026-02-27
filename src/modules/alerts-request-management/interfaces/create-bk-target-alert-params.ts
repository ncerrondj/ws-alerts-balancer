import { IBkAlertsSpParams } from "../../../database/sp/interfaces/bk-alert-params.sp";

export type ICreateBkTargetAlertParams = Pick<IBkAlertsSpParams, 'id' | 'targetType' | 'targetId'>;