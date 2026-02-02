import { PopUpCrudConditions } from "./enums/pop-up-conditions.enum"

export interface IPopUpSpParams {
    condition: PopUpCrudConditions,
    code: number;
    userId: number;
    type: string;
    targetType: string;
    title: string;
    message: string;
    targetPerfilId: number;
    excludeLauncher: boolean;
    fromDateFilter: string;
    toDateFilter: string;
    modalWidth: number;
    modalHeight: number;
    targetUserId: number;
    requiredVisualization: boolean;
    subTypeId?: number;
}