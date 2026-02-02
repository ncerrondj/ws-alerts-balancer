import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../../database/database.service";
import { ICreatCyclicalPopUpParams } from "../interfaces/create-cyclical-pop-up.params";
import { ICyclicalPopUpSpParams } from "../../../database/sp/interfaces/cyclical-pop-up-params.sp";
import { CyclicalPopUpConditions } from "../../../database/sp/interfaces/enums/cyclical-pop-up-conditions.enum";
import { PopUpDefaults } from "../../../database/sp/defaults/pop-up.default";
import { PopUpSp } from "../../../database/sp/enums/pop-up.sp";
import { DbUtils } from "../../../database/utils/db.utils";
import { CyclicalPopUp, PopUpTarget } from "../interfaces/cyclical-pop-up";

@Injectable()
export class CyclicalPopUpRepository {
    constructor(
        private readonly db: DatabaseService
    ) {}
    async getAllPending(cycleId?: number): Promise<CyclicalPopUp[]> {
        const paramsArray = this.getFinalParams({cycleId}, CyclicalPopUpConditions.LIST);
        const rows = await this.db.callProcedure(PopUpSp.CrudCyclicalPopUp, paramsArray);
        const cyclicalPopUpData: CyclicalPopUp[]  = rows[0]?.map(DbUtils.normalizeRow) ?? [];
        const targets: PopUpTarget[] = rows[1]?.map(DbUtils.normalizeRow) ?? [];
        cyclicalPopUpData.forEach(cycle => {
            if(!cycle.OBJETIVOS) cycle.OBJETIVOS = [];
            targets.forEach(target => {
                if(target.CODIGO_NOTIFICACION == cycle.CODIGO_NOTIFICACION) {
                    cycle.OBJETIVOS.push(target);
                }
            });
        })
        return cyclicalPopUpData;
    }
    async getById(cycleId: number): Promise<CyclicalPopUp> {
        const data = await this.getAllPending(cycleId);
        return data[0];
    }
    async createCycle(data: ICreatCyclicalPopUpParams): Promise<{id: number}> {
        const paramsArray = this.getFinalParams(data, CyclicalPopUpConditions.INSERT);
        const rows = await this.db.callProcedure(PopUpSp.CrudCyclicalPopUp, paramsArray);
        const id = rows[0][0].ULTIMO_ID as number;
        return {
            id,
        };
    }
    async addCycleIteration(cycleId: number) {
        const paramsArray = this.getFinalParams({ cycleId }, CyclicalPopUpConditions.ADD_CYCLE_ITERATION);
        await this.db.callProcedure(PopUpSp.CrudCyclicalPopUp, paramsArray);
    }
    async finishCycle(cycleId: number) {
        const paramsArray = this.getFinalParams({ cycleId }, CyclicalPopUpConditions.FINISH_CYCLE);
        await this.db.callProcedure(PopUpSp.CrudCyclicalPopUp, paramsArray);
    }

    private getFinalParams(params: Partial<ICyclicalPopUpSpParams>, condition: CyclicalPopUpConditions) {
            const final = {
                ...PopUpDefaults.cyclicalPopUpCrud,
                ...params
            };
            const paramsArray = [
                condition,
                final.cycleId,
                final.popUpId,
                final.secondsInterval,
                final.cyclesNumber,
                final.done,
                final.jsonData
            ];
            return paramsArray;
        }
}