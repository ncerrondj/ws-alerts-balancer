import { IPopUpMappingSpParams } from "../../../database/sp/interfaces/pop-up-mapping-params.sp";

export type ICreatePopUpMapping = Pick<IPopUpMappingSpParams, 'chrNotificationType' | 'notificationSubTypeId' | 'notificationId' | 'referenceCode' | 'referenceCode2' | 'referenceCode3'>;