import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/local-auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@WebSocketGateway({
  cors: {
    origin: '*', // или указать конкретные фронтенды
  },
})
export class CommentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly commentsService: CommentsService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  private clients: Map<string, number> = new Map();

  async handleConnection(client: Socket) {
    try {
      let token =
        client.handshake.auth?.token ||
        client.handshake.headers['authorization'];

      if (!token) throw new Error('No token provided');

      // Remove 'Bearer ' prefix if present
      if (typeof token === 'string' && token.startsWith('Bearer ')) {
        token = token.slice(7);
      }
      if (!token) throw new Error('No token provided');
      const payload: any = jwt.verify(token, process.env.JWT_SECRET_KEY);

      client.data.user = payload.user;
      this.clients.set(client.id, payload.user.id);
    } catch (err) {
      console.log('WebSocket connection unauthorized:', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
  }

  @SubscribeMessage('createComment')
  async createComment(
    @MessageBody() createCommentDto: CreateCommentDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user?.id;
    if (!userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const comment = await this.commentsService.create(createCommentDto, userId);

    this.eventEmitter.emit('comment.created', comment);

    return comment;
  }

  @OnEvent('comment.created')
  handleNewCommentEvent(comment: any) {
    for (const [clientId, userId] of this.clients.entries()) {
      const socket = this.server.sockets.sockets.get(clientId);
      if (socket) {
        socket.emit('commentAdded', comment);
      }
    }
  }
}
