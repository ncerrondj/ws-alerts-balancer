import { IInsercionIncidenciasSpParams } from "./interfaces/insercion-incidencias-params.sp";

export class IncidenciasSpDefaults {
    static readonly insercion: IInsercionIncidenciasSpParams = {
        agente: null,
        anio: null,
        codigoAduana: null,
        codigoIncidencia: null,
        codigoRegimen: null,
        ctrlImp: null,
        ctrlTrans: null,
        fechaProg: null,
        flag: null,
        flag2: null,
        incidencia: null,
        ippc: null,
        marca: null,
        nombreSubIncidencia: null,
        observacion: null,
        orden: null,
        pcIp: null,
        persReci: null,
        subIncidencia: null,
        tipoIncidencia: null,
        userId: null
    };
}