import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { PopUpDefaults } from '../../../database/sp/defaults/pop-up.default';
import { PopUpSp } from '../../../database/sp/enums/pop-up.sp';
import { PopUpGetTargetsConditions } from '../../../database/sp/interfaces/enums/pop-up-get-targets-conditions.enum';
import { IPopUpGetTargetsSpParams } from '../../../database/sp/interfaces/pop-up-get-targets-params.sp';
import { IGetAcePopUpTargetsParams } from '../interfaces/get-ace-pop-up-targets.params';
import { IAcePopUpTargetsData } from '../interfaces/ace-pop-up-targets-data';

@Injectable()
export class PopUpGetTargetsRepository {
    constructor(
        private readonly db: DatabaseService
    ) {}
    async getAcePopUpTargets(params: IGetAcePopUpTargetsParams) {
        const paramsArray = this.getFinalParams(params, PopUpGetTargetsConditions.FOR_ACE);
        const rows = await this.db.callProcedure(PopUpSp.GetTargets, paramsArray);
        const first = rows[0];
        if (!first) return [];
        if(!first.length) return [];
        const data: IAcePopUpTargetsData = first[0];
        const userIds = new Set([data.CODIGO_JEFE_SECTORISTA, data.CODIGO_JEFE_SOLICITANTE, data.CODIGO_USUARIO_SECTORISTA, data.CODIGO_USUARIO_SOLICITANTE].filter(Boolean));
        return Array.from(userIds);
    }

    private getFinalParams(params: Partial<IPopUpGetTargetsSpParams>, condition: PopUpGetTargetsConditions) {
        const final = {
            ...PopUpDefaults.getTargets,
            ...params
        };
        const paramsArray = [
            condition,
            final.dam,
            final.year,
            final.aduana,
            final.regimen
        ];
        return paramsArray;
    }
}