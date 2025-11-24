import { IAlertNotificationConfigSpParams } from "./interfaces/alert-notification-config-params.sp";

export class AlertConfigSpDefaults {
    static readonly crud: IAlertNotificationConfigSpParams = {
        contition: null,
        alertTypeId: null,
        userId: null,
        intermittentSound: null,
        notificationSound: null,
        generalSound: null
    }
}