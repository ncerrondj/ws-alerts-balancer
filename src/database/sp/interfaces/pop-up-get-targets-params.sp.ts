import { PopUpGetTargetsConditions } from "./enums/pop-up-get-targets-conditions.enum";

export interface IPopUpGetTargetsSpParams {
    condition: PopUpGetTargetsConditions;
    dam: string;
    year: string;
    aduana: string;
    regimen: string;
}