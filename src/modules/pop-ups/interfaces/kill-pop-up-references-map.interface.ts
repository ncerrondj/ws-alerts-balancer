import { IPopUpMappingSpParams } from "../../../database/sp/interfaces/pop-up-mapping-params.sp";

export type IKillPopUpReferencesMap = Pick<IPopUpMappingSpParams, 'referenceCode' | 'referenceCode2' | 'referenceCode3' | 'chrNotificationType' | 'notificationSubTypeId' | 'finisherUserId'>