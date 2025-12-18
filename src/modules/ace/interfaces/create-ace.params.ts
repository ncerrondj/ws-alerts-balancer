import { IAceSpParams } from "../../../database/sp/interfaces/ace-params.sp";

export type ICreateAceParams = Pick<IAceSpParams, 
    'aceNumber' |
    'dataRegisterDate' |
    'dataRegisterTime' |
    'aceStatusTable' |
    'aceId' |
    'controlFlujoAce' |
    'aceStatusDetail' |
    'funcionarioAsignadoAce' |
    'aceSelectedUnity' |
    'aceSelectedUnityNumber' |
    'aceCommunicationMoment' |
    'aceCommunicationDatetime' |
    'tipoLugarInspeccionAce' |
    'rucInspeccionAce' |
    'razonSocialInspeccionAce' |
    'direccionInspeccionAce' |
    'userId'
>