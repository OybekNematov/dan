import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AdminGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('userMessage')
  handleMessage(client: Socket, payload: { message: string }) {
    // Adminga xabarni yuborish
    this.server.emit('adminMessage', payload);
  }

  sendMessageToUser(clientId: string, message: string) {
    this.server.to(clientId).emit('adminMessage', { message });
  }
}
