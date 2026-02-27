import { IBkAlertsSpParams } from "../../../database/sp/interfaces/bk-alert-params.sp";

export type ICreateBkAlertParams = Pick<IBkAlertsSpParams, 'programedCreationDatetime' | 'alertTypeId' | 'userId' | 'title' | 'redirectionUrl' | 'autoDestructionDatetime' | 'jsonAlertBody' | 'templateId' | 'aditionalInformation' | 'referenceCode' | 'referenceCode2'>;