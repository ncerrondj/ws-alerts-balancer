import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlertsRequestManagementModule } from './modules/alerts-request-management/alerts-request-management.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { MessageModule } from './messages/message.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { LocksCaprinetModule } from './modules/locks-caprinet/locks-caprinet.module';
import { TaskModule } from './modules/tasks/task.module';
import { IncidenctsModule } from './modules/incidents/incidents.module';
import { PendingRegularizationModule } from './modules/pending-regularization/pending-regularization.module';
import { PopUpsModule } from './modules/pop-ups/pop-ups.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AlertsRequestManagementModule,
    MessageModule,
    CacheModule.register({
      ttl: 0, // it means that the cache will never expire
      max: 500,
      isGlobal: true,
    }),
    HttpModule,
    ConfigModule.forRoot({isGlobal: true}),
    DatabaseModule,
    LocksCaprinetModule,
    TaskModule,
    IncidenctsModule,
    PendingRegularizationModule,
    PopUpsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
