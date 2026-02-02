import { ICyclicalPopUpSpParams } from "../../../database/sp/interfaces/cyclical-pop-up-params.sp";

export type ICreatCyclicalPopUpParams = Pick<ICyclicalPopUpSpParams, 'popUpId' | 'secondsInterval' | 'jsonData'>;