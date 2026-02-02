import { CyclicalPopUpDto } from "../../../messages/model/cyclical-pop-up.dto";

export class IInitCycleParams {
    cycleId: number | null;
    popUpId: number;
    cyclicalPopUpDto: CyclicalPopUpDto;
}