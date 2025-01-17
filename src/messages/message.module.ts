import { forwardRef, Module } from '@nestjs/common';import { MessageController } from './controllers/message.controller';
import { AlertsRequestManagementModule } from 'src/alerts-request-management/alerts-request-management.module';
import { MessageService } from './services/message.service';

@Module({
  providers: [
    MessageService,
  ],
  controllers: [
    MessageController,
  ],
  imports: [
    forwardRef(() => AlertsRequestManagementModule),
  ],
  exports: [
    MessageService,
  ],
})
export class MessageModule {

}