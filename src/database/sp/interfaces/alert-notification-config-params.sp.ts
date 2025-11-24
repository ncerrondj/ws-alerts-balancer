export enum AlertNotificationConfigConditions {
    LIST = 'L',
    UPDATE_BY_TYPE = 'U',
    UPDATE = 'A',
}
export interface IAlertNotificationConfigSpParams {
    contition: AlertNotificationConfigConditions;
    userId: number;
    alertTypeId: number;
    intermittentSound: number;
    notificationSound: number;
    generalSound: number;
}