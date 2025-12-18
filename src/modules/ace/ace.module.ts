import { Module } from '@nestjs/common';
import { AceRepository } from './repositories/ace.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
    controllers: [],
    providers: [AceRepository],
    imports: [DatabaseModule],
    exports: [AceRepository]
})
export class AceModule {};