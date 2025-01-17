import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlertsRequestManagementModule } from './alerts-request-management/alerts-request-management.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { MessageModule } from './messages/message.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
