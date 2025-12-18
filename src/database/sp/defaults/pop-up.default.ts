import { IPopUpGetTargetsSpParams } from "../interfaces/pop-up-get-targets-params.sp";
import { IPopUpSpParams } from "../interfaces/pop-up-params.sp";
import { IPopUpTargetSpParams } from "../interfaces/pop-up-target-params.sp";

export class PopUpDefaults {
    static crud: IPopUpSpParams = {
            condition: null,
            code: null,
            userId: null,
            targetType: null,
            excludeLauncher: null,
            fromDateFilter: null,
            message: null,
            modalHeight: null,
            modalWidth: null,
            targetPerfilId: null,
            title: null,
            toDateFilter: null,
            type: null,
            targetUserId: null,
            requiredVisualization: null
    };
    static detailsCrud: IPopUpTargetSpParams = {
        condition: null,
        popUpId: null,
        targetUserId: null,
        userCreationId: null
    }
    static getTargets: IPopUpGetTargetsSpParams = {
        condition: null,
        aduana: null,
        dam: null,
        regimen: null,
        year: null
    }
}