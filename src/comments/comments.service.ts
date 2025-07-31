import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { validateGetById } from 'src/common/helpers/validateGetById';
import { Comment } from './entities/comment.entity';
import { CommentPageDto } from 'src/pagination/comments/comment-page.dto';
import { PageDto } from 'src/pagination/page.dto';
import { PageMetaDto } from 'src/pagination/page-meta.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentCreatedEvent } from './events/comment-created.event';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UsersService,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(createCommentDto: CreateCommentDto, userId: number) {
    const { parentCommentId, text, ...otherDto } = createCommentDto;
    const parent = parentCommentId ? await this.findOne(parentCommentId) : null;
    const user = await this.userService.findOne(userId);
    const comment = this.commentRepository.create({
      parent,
      user,
      text,
      ...otherDto,
    });
    const savedComment = await this.commentRepository.save(comment);

    if (savedComment.parent) {
      await this.commentRepository.increment(
        { id: savedComment.parent.id },
        'childrenCount',
        1,
      );
    }
    await this.cacheManager.clear();
    // Emit the event after the comment is created used for logging or other side effects(email notifications, etc.)
    const commentCreatedEvent: CommentCreatedEvent = {
      id: savedComment.id,
      userId: user.id,
      parentCommentId: savedComment.parent?.id,
    };
    this.eventEmitter.emit('comment.created', commentCreatedEvent);
    return 201;
  }

  // Main method for root comments
  async findRootCommentsWithChildrenPaginated(
    pageOptionsDto: CommentPageDto,
  ): Promise<PageDto<Comment>> {
    const { page, take, sortBy, order } = pageOptionsDto;
    const skip = (page - 1) * take;

    const cacheKey = `root_comments_page_${page}_take_${take}_sort_${sortBy}_${order}`;
    // Check if the data is already cached
    const cached = await this.cacheManager.get<PageDto<Comment>>(cacheKey);
    if (cached) {
      return cached;
    }

    const [comments, itemCount] = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.email'])
      .where('comment.parent IS NULL')
      //By default, sort by createdAt if no sortBy is provided
      .orderBy(sortBy || 'comment.createdAt', order || 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    const result = new PageDto(comments, pageMetaDto);

    await this.cacheManager.set(cacheKey, result);
    return result;
  }

  async findChildrenByParentId(
    parentId: number,
    page: number = 1,
    take: number = 5,
  ): Promise<PageDto<Comment>> {
    const skip = (page - 1) * take;
    const cacheKey = `children_comments_parent_${parentId}_page_${page}_take_${take}`;

    const cached = await this.cacheManager.get<PageDto<Comment>>(cacheKey);
    if (cached) {
      return cached;
    }
    const [children, itemCount] = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .leftJoin('comment.children', 'children')
      .leftJoin('children.user', 'childrenUser')
      .addSelect([
        'user.id',
        'user.name',
        'children.id',
        'children.text',
        'children.createdAt',
        'childrenUser.id',
        'childrenUser.name',
      ])
      .where('comment.parent = :parentId', { parentId })
      .orderBy('comment.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: { page, take },
      itemCount,
    });

    const result = new PageDto(children, pageMetaDto);
    await this.cacheManager.set(cacheKey, result);

    return result;
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
