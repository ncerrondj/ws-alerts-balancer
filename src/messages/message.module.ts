import { forwardRef, Module } from '@nestjs/common';import { MessageController } from './controllers/message.controller';
import { AlertsRequestManagementModule } from '../modules/alerts-request-management/alerts-request-management.module';
import { MessageService } from './services/message.service';
import { PopUpsModule } from '../modules/pop-ups/pop-ups.module';

@Module({
  providers: [
    MessageService,
  ],
  controllers: [
    MessageController,
  ],
  imports: [
    forwardRef(() => AlertsRequestManagementModule),
    PopUpsModule
  ],
  exports: [
    MessageService,
  ],
})
export class MessageModule {

}