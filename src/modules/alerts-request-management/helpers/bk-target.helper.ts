import { DbUtils } from "../../../database/utils/db.utils";
import { IBkAlert, IBkTarget } from "../interfaces/bk-alert";
import { EmitAlertMessagePayload } from "../model/emit-alert-message.payload";
import { BkTargetAlertType } from "../../../database/sp/interfaces/bk-alert-params.sp";

export class BkTargetHelper {
    static mapTargetsOnAlertsBk(dataBkAlerts: IBkAlert[], bkTargets: IBkTarget[]) {
        const map = new Map<number, IBkAlert>();
        dataBkAlerts.forEach(bkAlert => {
            bkAlert.BK_TARGETS = [];
            map.set(bkAlert.CODIGO, bkAlert);
        });
        bkTargets.forEach(bkTarget => {
            map.get(bkTarget.CODIGO_BK_ALERTA).BK_TARGETS.push(bkTarget);
        })
    }
    static toEmitAlertMessagePayload(data: IBkAlert): EmitAlertMessagePayload {
        const areaTargetIds = data.BK_TARGETS?.filter(bkTarget => bkTarget.TIPO_OBJETIVO === BkTargetAlertType.AREA).map(target => target.CODIGO_OBJETIVO.toString());
        const perfilTargetIds = data.BK_TARGETS?.filter(bkTarget => bkTarget.TIPO_OBJETIVO === BkTargetAlertType.PERFIL).map(target => target.CODIGO_OBJETIVO.toString());
        const userTargetIds = data.BK_TARGETS?.filter(bkTarget => bkTarget.TIPO_OBJETIVO === BkTargetAlertType.USER).map(target => target.CODIGO_OBJETIVO.toString());
        let mapeoFinalizacion = null;
        if (data.CODIGO_REFERENCIA !== undefined && data.CODIGO_REFERENCIA !== null) {
            mapeoFinalizacion = {
                codigoReferencia: data.CODIGO_REFERENCIA,
                codigoReferencia2: data.CODIGO_REFERENCIA2
            };
        }
        return {
            codigoAlerta: null,
            codigoPlantilla: data.CODIGO_PLANTILLA.toString(),
            codigoTipoAlerta: data.CODIGO_TIPO_ALERTA,
            codigoUsuarioOrigen: data.CODIGO_USUARIO,
            data: JSON.parse(data.CUERPO_ALERTA),
            fechaHoraProgramacion: DbUtils.toJsonDate(data.FECHA_HORA_CREACION_ALERTA_PROGRAMADA),
            fechaAutoDestruccion: DbUtils.toJsonDate(data.FECHA_AUTO_DESTRUCCION),
            informacionAdicional: data.INFORMACION_ADICIONAL,
            userId: data.CODIGO_USUARIO.toString(),
            titulo: data.TITULO,
            perfilId: null,
            urlRedireccion: data.URL_REDIRECCION,
            objetivos: {
                codigosAreasObjetivos: areaTargetIds,
                codigosPerfilesObjectivos: perfilTargetIds,
                codigosUsuariosObjetivos: userTargetIds
            },
            mapeoFinalizacion
        };
    }
}