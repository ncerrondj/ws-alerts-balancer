import { IPopUpMappingSpParams } from "../../../database/sp/interfaces/pop-up-mapping-params.sp";

export type IKillAndGetPopUpMapping = Pick<IPopUpMappingSpParams, 'chrNotificationType' | 'notificationSubTypeId' | 'referenceCode' | 'referenceCode2' | 'referenceCode3' | 'finisherUserId'>