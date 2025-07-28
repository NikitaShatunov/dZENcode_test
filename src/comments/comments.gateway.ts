import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Req } from '@nestjs/common';
import { Server } from 'socket.io';

@WebSocketGateway()
export class CommentsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly commentsService: CommentsService) {}

  @SubscribeMessage('createComment')
  async create(@MessageBody() createCommentDto: CreateCommentDto, @Req() req) {
    const userId = req.user?.id || 1; // Default to 1 if user is not authenticated
    const created = await this.commentsService.create(createCommentDto, userId);

    // this.server.to(`post_${created.post.id}`).emit('newComment', created);
    return created;
  }

  @SubscribeMessage('findAllComments')
  findAll() {
    return this.commentsService.findAll();
  }

  @SubscribeMessage('findOneComment')
  findOne(@MessageBody() id: number) {
    return this.commentsService.findOne(id);
  }

  @SubscribeMessage('removeComment')
  remove(@MessageBody() id: number) {
    return this.commentsService.remove(id);
  }
}
