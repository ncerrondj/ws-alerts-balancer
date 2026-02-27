import { BkTargetAlertType } from "../../../database/sp/interfaces/bk-alert-params.sp";

export interface IBkTarget {
    CODIGO: number;
    CODIGO_BK_ALERTA: number;
    TIPO_OBJETIVO: BkTargetAlertType;
    CODIGO_OBJETIVO: number;
}
export interface IBkAlert {
    CODIGO: number;
    FECHA_HORA_CREACION_ALERTA_PROGRAMADA: string;
    FECHA_HORA_CREACION_ALERTA: string; 
    CREADO: boolean;
    ABORTADO: boolean;
    CODIGO_ALERTA: number;
    CODIGO_TIPO_ALERTA: number;
    CODIGO_USUARIO: number;
    TITULO: string;
    URL_REDIRECCION: string;
    FECHA_AUTO_DESTRUCCION: string;
    CUERPO_ALERTA : string;
    FECHA_CREACION: string;
    CODIGO_PLANTILLA: number;
    INFORMACION_ADICIONAL: string;
    BK_TARGETS?: IBkTarget[];
    CODIGO_REFERENCIA: string;
    CODIGO_REFERENCIA2: string;
}
