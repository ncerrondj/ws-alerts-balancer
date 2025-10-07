export enum GetPendingRegularizationConditionsSp {
    LIST_FOR_ALERTS = 'L',
    CHECKING_FOR_CREATION = 'C'
}
export interface IGetPendingRegularizationSpParams {
    condition: GetPendingRegularizationConditionsSp;
    codes: string;
    id: number;
}