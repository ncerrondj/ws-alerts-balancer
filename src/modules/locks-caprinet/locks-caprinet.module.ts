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

@Module({
   controllers: [LocksCaprinetController],
   providers: [BkLocksCaprinetRepository, LockCaprinetService, LocksExistenceMappingRepository, LocksCaprinetRepository],
   exports: [BkLocksCaprinetRepository, LocksExistenceMappingRepository],
   imports: [DatabaseModule, TaskModule, AlertsRequestManagementModule, IncidenctsModule]
})
export class LocksCaprinetModule {}