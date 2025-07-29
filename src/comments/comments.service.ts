import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { validateGetById } from 'src/common/helpers/validateGetById';
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
    const parent = parentCommentId ? await this.findOne(parentCommentId) : null;
    const user = await this.userService.findOne(userId);
    const comment = this.commentRepository.create({ parent, user, text });
    const savedComment = await this.commentRepository.save(comment);

    if (savedComment.parent) {
      await this.commentRepository.increment(
        { id: savedComment.parent.id },
        'childrenCount',
        1,
      );
    }
    return 201;
  }

  // Main method for root comments
  async findRootCommentsWithChildrenPaginated(page: number, limit: number) {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { parent: null },
      relations: { user: true }, // We show only first level
      select: {
        user: { id: true, name: true },
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: comments,
      total,
      page,
      limit,
    };
  }

  async findChildrenByParentId(
    parentId: number,
    page: number = 1,
    limit: number = 5,
  ) {
    const [children, total] = await this.commentRepository.findAndCount({
      where: { parent: { id: parentId } },
      relations: ['user', 'children', 'children.user'],
      select: {
        user: { id: true, name: true },
        children: {
          id: true,
          text: true,
          createdAt: true,
          user: { id: true, name: true },
        },
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: children,
      total,
      page,
      limit,
      parentId,
    };
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
