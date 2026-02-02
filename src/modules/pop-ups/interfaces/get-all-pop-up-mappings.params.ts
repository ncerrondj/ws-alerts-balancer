import { IPopUpMappingSpParams } from "../../../database/sp/interfaces/pop-up-mapping-params.sp";

export type IGetAllPopUpMappings = Partial<Pick<IPopUpMappingSpParams, 'chrNotificationType' | 'notificationId' | 'referenceCode2' | 'referenceCode3' | 'referenceCode' | 'notificationSubTypeId' | 'deathMapping'>>;