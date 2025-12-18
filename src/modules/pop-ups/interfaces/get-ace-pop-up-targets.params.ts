import { IPopUpGetTargetsSpParams } from "../../../database/sp/interfaces/pop-up-get-targets-params.sp";

export type IGetAcePopUpTargetsParams = Pick<IPopUpGetTargetsSpParams, 'dam' | 'aduana' | 'regimen' | 'year'>;