import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { PendingRegularizationRepository } from "./repositories/pending-regularization.repository";

@Module({
    imports: [DatabaseModule],
    providers: [PendingRegularizationRepository],
    exports: [PendingRegularizationRepository],
})
export class PendingRegularizationModule {}