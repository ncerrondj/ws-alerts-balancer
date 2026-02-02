import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../../database/database.service";
import { ICreatePopUpMapping } from "../interfaces/create-pop-up-mapping.params";
import { ICreatedDbResponse } from "../../../database/interface/created-db-response.interface";
import { IPopUpMappingSpParams } from "../../../database/sp/interfaces/pop-up-mapping-params.sp";
import { PopUpMappingCrudConditions } from "../../../database/sp/interfaces/enums/pop-up-mapping-conditions.enum";
import { PopUpDefaults } from "../../../database/sp/defaults/pop-up.default";
import { PopUpSp } from "../../../database/sp/enums/pop-up.sp";
import { IGetAllPopUpMappings } from "../interfaces/get-all-pop-up-mappings.params";
import { DbUtils } from "../../../database/utils/db.utils";
import { PopUpMapping } from "../interfaces/pop-up-mapping";
import { IKillAndGetPopUpMapping } from "../interfaces/kill-and-get-pop-up-mapping.params";

@Injectable()
export class PopUpMappingRepository {
    constructor(
        private readonly db: DatabaseService
    ) {}
    async getAll(params: IGetAllPopUpMappings): Promise<PopUpMapping[]> {
        const paramsArray = this.getFinalParams(params, PopUpMappingCrudConditions.LIST);
        const rows = await this.db.callProcedure(PopUpSp.CrudPopUpMapping, paramsArray);
        return rows[0]?.map(DbUtils.normalizeRow) ?? [];
    }
    async create(params: ICreatePopUpMapping): Promise<ICreatedDbResponse> {
        const paramsArray = this.getFinalParams(params, PopUpMappingCrudConditions.INSERT);
        const rows = await this.db.callProcedure(PopUpSp.CrudPopUpMapping, paramsArray);
        const id = rows[0][0].ULTIMO_ID as number;
        return {
            id,
        };
    }
    async killAndGet(params: IKillAndGetPopUpMapping) {
        const paramsArray = this.getFinalParams(params, PopUpMappingCrudConditions.FINISH_BY_IDS);
        const rows = await this.db.callProcedure(PopUpSp.CrudPopUpMapping, paramsArray);
        return rows[0]?.map(DbUtils.normalizeRow) ?? [];
    }
    
    private getFinalParams(params: Partial<IPopUpMappingSpParams>, condition: PopUpMappingCrudConditions) {
        const final: IPopUpMappingSpParams = {
            ...PopUpDefaults.mappingCrud,
            ...params
        };
        const paramsArray = [
            condition,
            final.codes,
            final.notificationId,
            final.chrNotificationType,
            final.notificationSubTypeId,
            final.referenceCode,
            final.referenceCode2,
            final.referenceCode3,
            final.finisherUserId,
            final.deathMapping
        ];
        return paramsArray;
    }
}