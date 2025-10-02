import { forwardRef, Module } from "@nestjs/common";
import { IncidentRepository } from "./repositories/incidents.repository";
import { DatabaseModule } from "../../database/database.module";
import { PendingRegularizationModule } from "../pending-regularization/pending-regularization.module";
import { IncidentsController } from "./controllers/incidents.controller";
import { IncidentsPendientesRegularizarService } from "./services/incidencias-pendientes-regularizar.service";
import { LocksCaprinetModule } from "../locks-caprinet/locks-caprinet.module";

@Module({
    imports: [DatabaseModule, PendingRegularizationModule, forwardRef(() => LocksCaprinetModule)],
    controllers: [IncidentsController],
    providers: [IncidentRepository, IncidentsPendientesRegularizarService],
    exports: [IncidentRepository]
})
export class IncidenctsModule {}