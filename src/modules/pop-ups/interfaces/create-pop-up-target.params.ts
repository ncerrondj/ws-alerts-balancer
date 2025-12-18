import { IPopUpTargetSpParams } from "../../../database/sp/interfaces/pop-up-target-params.sp";

export type ICreatePopUpTarget = Pick<IPopUpTargetSpParams, 'popUpId' | 'targetUserId' | 'userCreationId'>;