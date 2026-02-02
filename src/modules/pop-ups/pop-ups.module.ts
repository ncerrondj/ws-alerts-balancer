import { forwardRef, Module } from '@nestjs/common';
import { PopUpsController } from './controllers/pop-ups.controller';
import { PopUpsService } from './services/pop-ups.service';
import { AceModule } from '../ace/ace.module';
import { PopUpRepository } from './repositories/pop-up.repository';
import { AlertsRequestManagementModule } from '../alerts-request-management/alerts-request-management.module';
import { DatabaseModule } from '../../database/database.module';
import { PopUpGetTargetsRepository } from './repositories/pop-up-get-targets.repository';
import { LevanteModule } from '../levante/levante.module';
import { CyclicalPopUpService } from './services/cyclical-pop-up.service';
import { CyclicalPopUpRepository } from './repositories/cyclical-pop-up.repository';
import { TaskModule } from '../tasks/task.module';
import { CyclicalPopUpAllowHandlerService } from './services/cyclical-pop-up-allow-handler.service';
import { CyclicalPopUpOnFinishHandlerService } from './services/cyclical-pop-up-on-finish-handler.service';
import { PopUpMappingRepository } from './repositories/pop-up-mapping.repository';

@Module({
    controllers: [PopUpsController],
    providers: [
        PopUpsService, 
        PopUpRepository, 
        PopUpGetTargetsRepository, 
        CyclicalPopUpService,
        CyclicalPopUpRepository,
        CyclicalPopUpAllowHandlerService,
        CyclicalPopUpOnFinishHandlerService,
        PopUpMappingRepository
    ],
    imports: [DatabaseModule, AceModule, forwardRef(() => AlertsRequestManagementModule), LevanteModule, TaskModule],
    exports: [PopUpRepository]
})
export class PopUpsModule { };