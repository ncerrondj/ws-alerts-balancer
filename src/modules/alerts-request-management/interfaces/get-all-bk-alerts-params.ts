import { IBkAlertsSpParams } from "../../../database/sp/interfaces/bk-alert-params.sp";

export type IGetAllBkAlertsParams = Partial<Pick<IBkAlertsSpParams, 'id' | 'aborted' | 'created'>>;