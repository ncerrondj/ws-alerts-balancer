import { IAlertNotificationConfigSpParams } from "../../../database/sp/interfaces/alert-notification-config-params.sp";

export type IUpdateAlertConfigParams = Pick<IAlertNotificationConfigSpParams, 'userId' | 'generalSound'>