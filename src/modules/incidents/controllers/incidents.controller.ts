import { Body, Controller, Post } from "@nestjs/common";
import { IncidentsPendientesRegularizarService } from "../services/incidencias-pendientes-regularizar.service";
import { GenerateIncidentsForRequestReprogramationDto } from "../dtos/generate-incidents-for-request-reprogramation.dto";

@Controller('incidents')
export class IncidentsController {
    constructor(
        private readonly incidentsPendientesRegularizar: IncidentsPendientesRegularizarService
    ) {}
    @Post('generateIncidentForRequestReprogramation')
    async generateIncidentForRequestReprogramation(
        @Body() data: GenerateIncidentsForRequestReprogramationDto
    ){
        return await this.incidentsPendientesRegularizar.generateIncidentForRequestReprogramation(data.targetUserId);
    }
} 