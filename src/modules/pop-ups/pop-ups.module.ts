import { forwardRef, Module } from '@nestjs/common';
import { PopUpsController } from './controllers/pop-ups.controller';
import { PopUpsService } from './services/pop-ups.service';
import { AceModule } from '../ace/ace.module';
import { PopUpRepository } from './repositories/pop-up.repository';
import { AlertsRequestManagementModule } from '../alerts-request-management/alerts-request-management.module';
import { DatabaseModule } from '../../database/database.module';
import { PopUpGetTargetsRepository } from './repositories/pop-up-get-targets.repository';

@Module({
    controllers: [PopUpsController],
    providers: [PopUpsService, PopUpRepository, PopUpGetTargetsRepository],
    imports: [DatabaseModule, AceModule, forwardRef(() => AlertsRequestManagementModule)],
    exports: [PopUpRepository]
})
export class PopUpsModule {};