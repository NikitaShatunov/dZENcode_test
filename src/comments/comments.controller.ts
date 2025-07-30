import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/local-auth/guards/jwt.guard';
import { CommentPageDto } from 'src/pagination/comments/comment-page.dto';
import { PageDto } from 'src/pagination/page.dto';
import { CommentDto } from 'src/pagination/comments/comment.dto';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    const userId = req.user?.user?.id;
    return await this.commentsService.create(createCommentDto, userId);
  }

  @Get('roots')
  async getRootComments(
    @Query() pageOptionsDto: CommentPageDto,
  ): Promise<PageDto<CommentDto>> {
    return this.commentsService.findRootCommentsWithChildrenPaginated(
      pageOptionsDto,
    );
  }

  @Get(':parentId/children')
  async getChildComments(
    @Param('parentId') parentId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.commentsService.findChildrenByParentId(parentId, page, limit);
  }
}
