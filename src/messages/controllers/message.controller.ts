import { Body, Controller, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { WsConnectionsService } from '../../alerts-request-management/services/ws-connections.service';
import { MessageDto } from '../model/message.dto';
import { MESSAGE_EVENTS } from '../enum/message-action.enum';
import { IngresoSolicitudesPendienteDto } from '../model/ingreso-solicitudes-pendiente.dto';
import { MessageService } from '../services/message.service';

@Controller('message')
export class MessageController {

  constructor(
    private readonly wsConnectionsService: WsConnectionsService,
    private readonly messageService: MessageService,
  ) {}

  @Post('everyone')
  sendMessageToEveryone(
    @Body() body: any,
  ) {
    const message = (body.message as string) ?? 'Mensaje vacío';
    this.wsConnectionsService.getAllConnections().forEach((client) => {
      client.emit(MESSAGE_EVENTS.MESSAGE, {message});
    });
    return 'Mensaje enviado a todos los clientes';
  }
  @Post('to-perfil/:perfilId')
  sendMessageToAllClientsWithPerfil(
    @Param('perfilId') perfilId: string,
    @Body() body: MessageDto,
  ) {
    const connetionsByPerfil = this.wsConnectionsService.getAllConnectionByPerfilId(perfilId);
    const message = body.message ?? 'Mensaje vacío';
    connetionsByPerfil.forEach((client) => {
      client.emit(
        MESSAGE_EVENTS.MESSAGE_BY_PERFIL + perfilId,
        {message}
      );
    });
  }

  @Post('ingreso-solicitudes-pendientes')
  sendMessageToAllClientsWithPerfilForPendingRequests(
    @Query('perfilId', ParseIntPipe) perfilId: number,
    @Body() body: IngresoSolicitudesPendienteDto,
  ) {
    const connetionsByPerfil = this.wsConnectionsService.getAllConnectionByPerfilId(perfilId.toString());
    const message = body.message ?? 'Mensaje vacío';
    connetionsByPerfil.forEach((client) => {
      const userId = this.wsConnectionsService.getUserId(client);
      if(body.userIdsToExcludeOfNotification?.length && body.userIdsToExcludeOfNotification?.includes(userId)) {
        return;
      }
      client.emit(
        MESSAGE_EVENTS.PENDING_REQUESTS_BY_PERFIL + perfilId,
        {message, title: body.title, codigoNotificacion: body.codigoNotificacion}
      );
    });
    return 'Mensaje enviado a todos los clientes con solicitudes pendientes';
  }

  @Post('simple')
  sendMessage(
    @Query('perfilId') perfilId: number,
    @Body() body: MessageDto,
  ) {
    return this.messageService.sendSimpleMessage(body, perfilId);
  }
  @Post('recarga-caprinet')
  recargaCaprinet(
    @Query('perfilId') perfilId: number,
    @Body() body: MessageDto,
  ) {
    return this.messageService.sendReloadCaprinetMessage(body, perfilId);
  }
}