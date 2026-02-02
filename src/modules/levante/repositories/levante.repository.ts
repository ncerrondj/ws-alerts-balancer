import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../../database/database.service";
import { ILevanteSpParams } from "../../../database/sp/interfaces/levante-params.sp";
import { LevanteSp } from "../../../database/sp/enums/levante.sp";
import { ILevanteBasicInfo } from "../interfaces/levante-basic-info";

@Injectable()
export class LevanteRepository {
     constructor(
        private readonly db: DatabaseService
    ) {}
    async getDataForFinishCyclicalPopUp(params: ILevanteSpParams): Promise<ILevanteBasicInfo> {
        const paramsArray = [params.aduana, params.regime, params.year, params.order];
        const rows = await this.db.callProcedure(LevanteSp.GetDataForCyclicalPopUp, paramsArray);
        const data = rows[0][0] as ILevanteBasicInfo;
        return data;
    }
}