import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsGateway } from './comments.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentsController } from './comments.controller';
import { LocalAuthModule } from 'src/local-auth/local-auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), LocalAuthModule, UsersModule],
  controllers: [CommentsController],
  providers: [CommentsGateway, CommentsService],
})
export class CommentsModule {}
