import { Injectable } from "@nestjs/common";
import { IInitCycleParams } from "../interfaces/init-cycle-params";
import { LevanteRepository } from "../../levante/repositories/levante.repository";

@Injectable()
export class CyclicalPopUpAllowHandlerService {
    constructor(
        private readonly levanteRepository: LevanteRepository,
    ) {}

    /**
     * Function para ver si se puede crear el proximo pop up ciclico
     */
    async canThrow(params: IInitCycleParams): Promise<boolean> {
        const mapHandler: { [k: string]: (params: IInitCycleParams) => Promise<boolean>} = {
            '7377': this.on7377CanThrowHandler.bind(this), //pendiente retiro
            '7379': this.on7379CanThrowHandler.bind(this), //pendiente levante
        };
        const handler = mapHandler[params.cyclicalPopUpDto.subTypeId];
        if (!handler) return true;
        return handler(params);
    }

    private async on7377CanThrowHandler(params: IInitCycleParams): Promise<boolean> {
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
        // si aun no hay fecha de retiro puede continuar
        const pendiente = !levanteInfo.FECHA_RETIRO || levanteInfo.FECHA_RETIRO === '0000-00-00 00:00:00';
        return pendiente;
    }
    private async on7379CanThrowHandler(params: IInitCycleParams): Promise<boolean> {
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
        // si aun no hay fecha de LEVANTE puede continuar
        const pendiente = !levanteInfo.FECHA_LEVANTE || levanteInfo.FECHA_LEVANTE === '0000-00-00 00:00:00';
        return pendiente;
    }
}