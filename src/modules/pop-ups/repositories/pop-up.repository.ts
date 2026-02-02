import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { ICreatedDbResponse } from '../../../database/interface/created-db-response.interface';
import { PopUpDefaults } from '../../../database/sp/defaults/pop-up.default';
import { PopUpCrudConditions } from '../../../database/sp/interfaces/enums/pop-up-conditions.enum';
import { IPopUpSpParams } from '../../../database/sp/interfaces/pop-up-params.sp';
import { ICreatePopUpParams } from '../interfaces/create-pop-up.params';
import { PopUpSp } from '../../../database/sp/enums/pop-up.sp';
import { IPopUpTargetSpParams } from '../../../database/sp/interfaces/pop-up-target-params.sp';
import { PopUpTargetsCrudConditions } from '../../../database/sp/interfaces/enums/pop-up-targets-conditions.enum';
import { ICreatePopUpTarget } from '../interfaces/create-pop-up-target.params';
import { IPopUp } from '../interfaces/pop-up.interface';
import { IGetAllPopUpsParams } from '../interfaces/get-all-pop-ups-params';
import { DbUtils } from '../../../database/utils/db.utils';

@Injectable()
export class PopUpRepository {
    constructor(
        private readonly db: DatabaseService
    ) {}
    async create(params: ICreatePopUpParams): ICreatedDbResponse {
        const paramsArray = this.getFinalParams(params, PopUpCrudConditions.INSERT);
        const rows = await this.db.callProcedure(PopUpSp.CrudPopUp, paramsArray);
        const id = rows[0][0].codigoNotificacion as number;
        return {
            id,
        };
    }
    async getAll(params: IGetAllPopUpsParams): Promise<IPopUp[]> {
        const paramsArray = this.getFinalParams(params, PopUpCrudConditions.LIST);
        const rows = await this.db.callProcedure(PopUpSp.CrudPopUp, paramsArray);
        return rows[0]?.map(DbUtils.normalizeRow) ?? [];
    }
    async addPopUpTarget(params: ICreatePopUpTarget): ICreatedDbResponse {
        const paramsArray = this.getDetailsFinalParams(params, PopUpTargetsCrudConditions.INSERT);
        const rows = await this.db.callProcedure(PopUpSp.CrudTargets, paramsArray);
        const id = rows[0][0].ULTIMO_ID as number;
        return {
            id,
        };
    }
    async markAsRead(popUpId: number, targetUserId: number) {
        const paramsArray = this.getDetailsFinalParams({
            popUpId,
            targetUserId
        }, PopUpTargetsCrudConditions.MARK_AS_READ);
        await this.db.callProcedure(PopUpSp.CrudTargets, paramsArray);
    }
    
    private getFinalParams(params: Partial<IPopUpSpParams>, condition: PopUpCrudConditions) {
        const final = {
            ...PopUpDefaults.crud,
            ...params
        };
        const paramsArray = [
            condition,
            final.code,
            final.userId,
            final.type,
            final.targetType,
            final.title,
            final.message,
            final.targetPerfilId,
            final.excludeLauncher,
            final.fromDateFilter,
            final.toDateFilter,
            final.modalWidth,
            final.modalHeight,
            final.targetUserId,
            final.requiredVisualization,
            final.subTypeId
        ];
        return paramsArray;
    }
    private getDetailsFinalParams(params: Partial<IPopUpTargetSpParams>, condition: PopUpTargetsCrudConditions) {
        const final = {
            ...PopUpDefaults.detailsCrud,
            ...params,
        };
        const paramsArray = [
            condition,
            final.popUpId,
            final.userCreationId,
            final.targetUserId,
            final.originCycle
        ];
        return paramsArray;
    }
}