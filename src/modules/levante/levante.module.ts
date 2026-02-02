import { Module } from "@nestjs/common";
import { LevanteRepository } from "./repositories/levante.repository";
import { DatabaseModule } from "../../database/database.module";

@Module({
    providers: [LevanteRepository],
    exports: [LevanteRepository],
    imports: [DatabaseModule]
})
export class LevanteModule {}