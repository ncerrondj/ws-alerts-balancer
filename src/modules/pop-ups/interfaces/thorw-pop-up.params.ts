import { PopUpTargetTypeEnum } from "../enums/pop-up-target-type.enum";

export interface IThrowPopUpParams {
    title: string;
    message: string;
    targetType: PopUpTargetTypeEnum;
    targetPerfilId?: number;
    excludeLancher: boolean; //1 o 0
    targetUserIds?: number[];
    modalWidth: number;
    modalHeight: number;
    popUpId: number;
}