import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { IGetAllAceParams } from '../interfaces/get-all-ace.params';
import { AceCrudContitionsSp, IAceSpParams } from '../../../database/sp/interfaces/ace-params.sp';
import { AceSpDefaults } from '../../../database/sp/defaults/ace.default';
import { AceSp } from '../../../database/sp/enums/ace.sp';
import { DbUtils } from '../../../database/utils/db.utils';
import { ICreateAceParams } from '../interfaces/create-ace.params';
import { IUpdateAceParams } from '../interfaces/update-ace.params';
import { Ace } from '../interfaces/ace';
import { ICreatedDbResponse } from '../../../database/interface/created-db-response.interface';

@Injectable()
export class AceRepository {
    constructor(
        private readonly db: DatabaseService
    ) {}
    async getAll(getAceParams: IGetAllAceParams): Promise<Ace[]> {
        const paramsArray = this.getFinalParams(getAceParams, AceCrudContitionsSp.LIST);
        const rows = await this.db.callProcedure(AceSp.Crud, paramsArray);
        return rows[0]?.map(DbUtils.normalizeRow) ?? [];
    }
    async create(params: ICreateAceParams): ICreatedDbResponse {
        const paramsArray = this.getFinalParams(params, AceCrudContitionsSp.INSERT);
        const rows = await this.db.callProcedure(AceSp.Crud, paramsArray);
        const id = rows[0][0].ULTIMO_ID as number;
        return {
            id,
        };
    }
    async updateById(code: number, params: IUpdateAceParams): Promise<void> {
        const paramsArray = this.getFinalParams({...params, code}, AceCrudContitionsSp.UPDATE);
        await this.db.callProcedure(AceSp.Crud, paramsArray);
    }
    private getFinalParams(params: Partial<IAceSpParams>, condition: AceCrudContitionsSp) {
        const final = {
            ...AceSpDefaults.crud,
            ...params
        };
        const paramsArray = [
            condition,
            final.code,
            final.aceNumber,
            final.dataRegisterDate,
            final.dataRegisterTime,
            final.aceStatusTable,
            final.aceId,
            final.controlFlujoAce,
            final.aceStatusDetail,
            final.funcionarioAsignadoAce,
            final.aceSelectedUnity,
            final.aceSelectedUnityNumber,
            final.aceCommunicationMoment,
            final.aceCommunicationDatetime,
            final.tipoLugarInspeccionAce,
            final.rucInspeccionAce,
            final.razonSocialInspeccionAce,
            final.direccionInspeccionAce,
            final.userId,
            final.aceIds,
        ];
        return paramsArray;
        
    }

}