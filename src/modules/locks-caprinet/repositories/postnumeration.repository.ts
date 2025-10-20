import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../../database/database.service";
import { IOpePostNumerationSpParams, OpePostNumerationConditions } from "../../../database/sp/interfaces/ope-postnumeration-params.sp";
import { PostNumeracionSp } from "../../../database/sp/postnumeracion.sp";
import { PostNumerationSpDefaults } from "../../../database/sp/postnumeration.default";
import { DbUtils } from "../../../database/utils/db.utils";
import { IPostnumerationData } from "../interfaces/postnumeration-data";

@Injectable()
export class PostNumerationRepository {
    constructor(
        private readonly db: DatabaseService
    ){}

    async getPostNumerationDataFromLocks(userId: number): Promise<IPostnumerationData[]> {
        const paramsArray = this.getFinalParams({
            userId
        }, OpePostNumerationConditions.GET_ORDERS_FROM_LOCKS);
        const rows = await this.db.callProcedure(PostNumeracionSp.OpePostNumeration, paramsArray);
        return rows[0]?.map(DbUtils.normalizeRow) ?? [];
    }
    private getFinalParams(params: Partial<IOpePostNumerationSpParams>, condition: OpePostNumerationConditions) {
        const final: IOpePostNumerationSpParams = {
        ...PostNumerationSpDefaults.opePostNumeration,
        ...params
        };
        const paramsArray = [
            condition,
            final.userId,
            final.liquidatorUserId,
            final.reviewerUserId,
            final.statusCode,
            final.subTypeId,
            final.requestNumerationId
        ];
        return paramsArray;
    } 
}