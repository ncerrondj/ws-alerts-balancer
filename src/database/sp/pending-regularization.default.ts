import { IGetPendingRegularizationSpParams } from "./interfaces/get-pending-regularization-for-alerts-params.sp";

export class PendingRegularizationSpDefaults {
    static readonly getForAlerts: IGetPendingRegularizationSpParams = {
        codes: '0'
    };
}