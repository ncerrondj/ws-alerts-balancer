import { Body, Controller, Post } from '@nestjs/common';
import { WsConnectionsService } from '../services/ws-connections.service';

@Controller('message')
export class MessageController {

  constructor(
    private readonly wsConnectionsService: WsConnectionsService,
  ) {}

  @Post('everyone')
  sendMessageToEveryone(
    @Body() body: any,
  ) {
    const message = (body.message as string) ?? 'Mensaje vacío';
    this.wsConnectionsService.getAllConnections().forEach((client) => {
      client.emit('message', {message});
    });
    return 'Mensaje enviado a todos los clientes';
  }
}