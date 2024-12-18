import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlertsRequestManagementModule } from './alerts-request-management/alerts-request-management.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), AlertsRequestManagementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
