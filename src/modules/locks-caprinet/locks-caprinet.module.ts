import { Module } from '@nestjs/common';
import { BkLocksCaprinetRepository } from './repositories/bk-locks-caprinet.repository';
import { DatabaseModule } from '../../database/database.module';
import { LocksCaprinetController } from './controllers/locks-caprinet.controller';
import { LockCaprinetService } from './services/lock-caprinet.service';
import { TaskModule } from '../tasks/task.module';
import { LocksExistenceMappingRepository } from './repositories/locks-existence-mapping.repository';
import { LocksCaprinetRepository } from './repositories/locks-caprinet.repository';
import { AlertsRequestManagementModule } from '../alerts-request-management/alerts-request-management.module';
import { IncidenctsModule } from '../incidents/incidents.module';
import { LocksPostponementManagerService } from './services/locks-postponement-manager.service';
import { PendingRegularizationModule } from '../pending-regularization/pending-regularization.module';

@Module({
   controllers: [LocksCaprinetController],
   providers: [BkLocksCaprinetRepository, LockCaprinetService, LocksExistenceMappingRepository, LocksCaprinetRepository, LocksPostponementManagerService],
   exports: [BkLocksCaprinetRepository, LocksExistenceMappingRepository],
   imports: [DatabaseModule, TaskModule, AlertsRequestManagementModule, IncidenctsModule, PendingRegularizationModule]
})
export class LocksCaprinetModule {}