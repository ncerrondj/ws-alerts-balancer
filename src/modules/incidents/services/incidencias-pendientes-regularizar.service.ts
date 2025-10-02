import { Injectable } from "@nestjs/common";
import { LocksExistenceMappingRepository } from "../../../modules/locks-caprinet/repositories/locks-existence-mapping.repository";
import { PendingRegularizationRepository } from "../../../modules/pending-regularization/repositories/pending-regularization.repository";
import { IncidentRepository } from "../repositories/incidents.repository";

@Injectable()
export class IncidentsPendientesRegularizarService {
    constructor(
        private readonly lockExistenceMappingRepo: LocksExistenceMappingRepository,
        private readonly pendingRegularizationRepo: PendingRegularizationRepository,
        private readonly incidentsRepo: IncidentRepository,
    ) {}

    async generateIncidentForRequestReprogramation(targetUserId: number) {
        const maps = await this.lockExistenceMappingRepo.getAll({
            lockTypeId: 7114,
            targetUserId
        });
        const numerationCodes = maps.filter(map => map.CODIGO_REFERENCIA && map.CODIGO_BLOQUEO).map(item => {
            const codNumeracion = item.CODIGO_REFERENCIA;
            return codNumeracion;
        }).join(',');
        const numerations = await this.pendingRegularizationRepo.getPendingRegularizationForAlerts(numerationCodes ? numerationCodes : '0');
        await Promise.all(numerations.map(async num => {
            const res = await this.incidentsRepo.create({
                orden: num.ORDEN,
                anio: num.ANIO,
                codigoAduana: num.CODIGO_ADUANA,
                codigoRegimen: num.CODIGO_REGIMEN,
                incidencia: 'Se solicita desbloqueo en CapriNet',
                codigoIncidencia: '555',
                marca: '*',
                fechaProg: new Date().toJSON(),
                userId: num.CODIGO_SOLICITANTE
            });
            return res;
        }));
        return {success: true};
    }
}
