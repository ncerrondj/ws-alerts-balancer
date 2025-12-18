import { PopUpTargetsCrudConditions } from "./enums/pop-up-targets-conditions.enum";

export interface IPopUpTargetSpParams {
    condition: PopUpTargetsCrudConditions;
    popUpId: number;
    userCreationId: number;
    targetUserId: number;
}