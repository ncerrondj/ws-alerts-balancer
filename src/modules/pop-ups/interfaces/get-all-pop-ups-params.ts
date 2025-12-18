import { IPopUpSpParams } from "../../../database/sp/interfaces/pop-up-params.sp";

export type IGetAllPopUpsParams = Pick<IPopUpSpParams, 'targetUserId'>;