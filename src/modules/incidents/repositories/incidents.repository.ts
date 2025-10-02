import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../../database/database.service";
import { ICreateIncidentParams } from "../interfaces/create-incident-params";
import { IInsercionIncidenciasSpParams } from "../../../database/sp/interfaces/insercion-incidencias-params.sp";
import { IncidenciasSpDefaults } from "../../../database/sp/incidencias.default";
import { DbUtils } from "../../../database/utils/db.utils";
import { IncidenciasCaprinetSp } from "../../../database/sp/incidencias.sp";

@Injectable()
export class IncidentRepository {
  constructor(
    private readonly db: DatabaseService
  ){}
  async create(params: ICreateIncidentParams) {
    const paramsArray = this.getFinalParams(params);
    const rows = await this.db.callProcedure(IncidenciasCaprinetSp.insercion, paramsArray);
    const NUME_REGI = rows[0][0].NUME_REGI as number;
    return {
        NUME_REGI
    }; 
  }
  private getFinalParams(params: Partial<IInsercionIncidenciasSpParams>) {
    const final: IInsercionIncidenciasSpParams = {
        ...IncidenciasSpDefaults.insercion,
        ...params
    };
    const paramsArray = [
        final.codigoAduana,
        final.codigoRegimen,
        final.anio,
        final.orden,
        final.incidencia,
        final.tipoIncidencia,
        final.codigoIncidencia,
        final.ctrlTrans,
        final.persReci,
        final.agente,
        final.marca,
        final.ctrlImp,
        final.observacion,
        final.subIncidencia,
        final.nombreSubIncidencia,
        DbUtils.toValidDate(final.fechaProg),
        final.flag,
        final.pcIp,
        final.ippc,
        final.flag2,
        final.userId
    ];
    return paramsArray;
  }
}