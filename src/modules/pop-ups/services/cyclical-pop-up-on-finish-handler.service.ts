import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PopUpsService } from "./pop-ups.service";
import { IInitCycleParams } from "../interfaces/init-cycle-params";
import { LevanteRepository } from "../../levante/repositories/levante.repository";

@Injectable()
export class CyclicalPopUpOnFinishHandlerService {
    constructor(
        @Inject(
            forwardRef(() => PopUpsService)
        )
        private readonly popUpService: PopUpsService,
        private readonly levanteRepository: LevanteRepository,
    ){}
    /**
     * Funcion que se puede ejecutar cuando un pop up ciclico no tiene permitido lanzarse y vaya a terminar su ciclo
    */
    async handle(params: IInitCycleParams) {
            const mapHandler: { [k: string]: (params: IInitCycleParams) => Promise<void>} = {
            '7377': this.on7377FinishHandler.bind(this)
        };
        const handler = mapHandler[params.cyclicalPopUpDto.subTypeId];
        if (!handler) return;
        handler(params);
    }
    private async on7377FinishHandler(params: IInitCycleParams) {
        const dto = params.cyclicalPopUpDto;
        const {
            pChrCodRegimen,
            pChrCodAduana,
            pChrAnioPrese,
            pChrNumOrden
        } = dto.jsonData;
        const levanteInfo = await this.levanteRepository.getDataForFinishCyclicalPopUp({
            aduana: pChrCodAduana,
            regime: pChrCodRegimen,
            year: pChrAnioPrese,
            order: pChrNumOrden
        });
        // si aun no hay fecha de autorizacion retiro puede continuar
        const pendiente = !levanteInfo.FECHA_LEVANTE || levanteInfo.FECHA_LEVANTE === '0000-00-00 00:00:00';
        if (pendiente) {
            await this.popUpService.cyclicalPopUp({
                jsonData: dto.jsonData,
                title: 'Pendiente de Levante DAM de Depósito',
                secondsInterval: dto.secondsInterval,
                targetUserIds: dto.targetUserIds,
                message: 'Estimados Usuarios se les recuerda que la DAM de Depósito se encuentra pendiente de Levante',
                userId: dto.userId,
                height: dto.height,
                width: dto.width,
                subTypeId: 7379,
                validateByMapping: true,
                // las mismas referencias pero con otro tipo
                referenceCode: dto.referenceCode,
                referenceCode2: dto.referenceCode2,
                referenceCode3: dto.referenceCode3
            });
        }
    }
}