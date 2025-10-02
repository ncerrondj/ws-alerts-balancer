import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../../database/database.service";
import { PendingRegularizationSp } from "../../../database/sp/pending-regularization.sp";
import { DbUtils } from "../../../database/utils/db.utils";
import { PendingRegularizationForAlert } from "../interfaces/pending-regularization-for-alert";

@Injectable()
export class PendingRegularizationRepository {
    constructor(
        private readonly db: DatabaseService
    ) {}
    async getPendingRegularizationForAlerts(codes: string): Promise<PendingRegularizationForAlert[]> {
        const paramsArray = [codes];
        const rows = await this.db.callProcedure(PendingRegularizationSp.GetForAlerts, paramsArray);
        return rows[0]?.map(DbUtils.normalizeRow) ?? [];
    }
}