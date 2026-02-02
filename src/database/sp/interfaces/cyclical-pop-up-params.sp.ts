import { CyclicalPopUpConditions } from "./enums/cyclical-pop-up-conditions.enum"

export interface ICyclicalPopUpSpParams {
    condition: CyclicalPopUpConditions;
    cycleId: number;
    popUpId: number;
    secondsInterval: number;
    cyclesNumber: number;
    done: boolean;
    jsonData: string;
}