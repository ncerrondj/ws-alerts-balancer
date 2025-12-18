export enum AceCrudContitionsSp {
    INSERT = 'I',
    UPDATE = 'U',
    LIST = 'L'
}
export interface IAceSpParams {
    condition: AceCrudContitionsSp;
    code: number;
    aceNumber: string;
    dataRegisterDate: string;
    dataRegisterTime: string;
    aceStatusTable: string;
    aceId: number;
    controlFlujoAce: string;
    aceStatusDetail: string;
    funcionarioAsignadoAce: string;
    aceSelectedUnity: string;
    aceSelectedUnityNumber: string;
    aceCommunicationMoment: string;
    aceCommunicationDatetime: string;
    tipoLugarInspeccionAce: string;
    rucInspeccionAce: string;
    razonSocialInspeccionAce: string;
    direccionInspeccionAce: string;
    userId: number;
    aceIds: string;
}