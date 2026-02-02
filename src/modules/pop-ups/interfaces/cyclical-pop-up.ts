export class PopUpTarget {
    CODIGO: number;
    CODIGO_NOTIFICACION: number;
    CODIGO_USUARIO_OBJETIVO: number;
    CODIGO_USUARIO_CREACION: number;
    VISUALIZADO: boolean;
    FECHA_VISUALIZACION: string;
    CODIGO_CICLO_ORIGEN: number;
    FECHA_CREACION: string;
}
export class CyclicalPopUp {
    CODIGO: number;
    CODIGO_NOTIFICACION: number;
    INTERVALO_SEGUNDOS: number;
    CANTIDAD_CICLOS: number;
    TERMINADO: boolean;
    FECHA_TERMINO: boolean;
    DATA_JSON: string;
    FECHA_ULTIMO_CICLO: string;
    TITULO_NOTIFICACION: string;
    MENSAJE_NOTIFICACION: string;
    CODIGO_USUARIO_CREADOR: number;
    CODIGO_SUBTIPO_NOTIFICACION: number;
    ANCHO_MODAL: number;
    ALTO_MODAL: number;
    OBJETIVOS?: PopUpTarget[];
}
