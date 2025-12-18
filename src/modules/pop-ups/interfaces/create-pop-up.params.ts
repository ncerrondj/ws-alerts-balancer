import { IPopUpSpParams } from "../../../database/sp/interfaces/pop-up-params.sp";

export type ICreatePopUpParams = Pick<IPopUpSpParams, 'userId' | 'type' | 'targetType' | 'title'   | 'message' | 'targetPerfilId' | 'excludeLauncher' | 'modalWidth' | 'modalHeight' | 'requiredVisualization'>;