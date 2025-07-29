import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Server, Socket } from 'socket.io';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@WebSocketGateway()
export class CommentsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly commentsService: CommentsService) {}

  @SubscribeMessage('createComment')
  async create(
    @MessageBody() createCommentDto: CreateCommentDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data?.user?.id;
    const comment = await this.commentsService.create(createCommentDto, userId);

    this.server.emit('commentAdded', comment);
    return comment;
  }
}
