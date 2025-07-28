import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { validateGetById } from 'src/helpers/validateGetById';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UsersService,
  ) {}
  async create(createCommentDto: CreateCommentDto, userId: number) {
    const { parentCommentId, text } = createCommentDto;
    const parent = await this.findOne(parentCommentId);
    const user = await this.userService.findOne(userId);
    const comment = this.commentRepository.create({ parent, user, text });
    return await this.commentRepository.save(comment);
  }

  async findAll() {
    const comments = await this.commentRepository.find({
      relations: ['parent', 'children', 'user'],
    });
    return comments;
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    validateGetById(id, comment, 'Comment');
    return comment;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
