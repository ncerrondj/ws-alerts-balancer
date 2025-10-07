import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../../database/database.service";
import { PendingRegularizationSp } from "../../../database/sp/pending-regularization.sp";
import { DbUtils } from "../../../database/utils/db.utils";
import { PendingRegularizationForAlert } from "../interfaces/pending-regularization-for-alert";
import { GetPendingRegularizationConditionsSp, IGetPendingRegularizationSpParams } from "../../../database/sp/interfaces/get-pending-regularization-for-alerts-params.sp";
import { PendingRegularizationSpDefaults } from "../../../database/sp/pending-regularization.default";

@Injectable()
export class PendingRegularizationRepository {
    constructor(
        private readonly db: DatabaseService
    ) {}
    async getPendingRegularizationForAlerts(codes: string): Promise<PendingRegularizationForAlert[]> {
        const paramsArray = this.getFinalParams({
            codes
        }, GetPendingRegularizationConditionsSp.LIST_FOR_ALERTS)
        const rows = await this.db.callProcedure(PendingRegularizationSp.GetForAlerts, paramsArray);
        return rows[0]?.map(DbUtils.normalizeRow) ?? [];
    }
    async canThrowAlerta(requestId: number) {
        const paramsArray = this.getFinalParams({
            id: requestId
        }, GetPendingRegularizationConditionsSp.CHECKING_FOR_CREATION);
        const res = await this.db.callProcedure(PendingRegularizationSp.GetForAlerts, paramsArray);
        const count = Number(res[0][0].CONTEO);
        return count > 0;
    }
    private getFinalParams(params: Partial<Omit<IGetPendingRegularizationSpParams, 'condition'>>, condition: GetPendingRegularizationConditionsSp) {
    const final: IGetPendingRegularizationSpParams = {
      ...PendingRegularizationSpDefaults.getForAlerts,
      ...params
    };
    const paramsArray = [
      condition,
      final.codes,
      final.id    
    ];
    return paramsArray;
  }
}