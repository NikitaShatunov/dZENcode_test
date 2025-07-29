import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsCleanHtml } from 'src/common/validators/is-clean-html.validator';

export class CreateCommentDto {
  @ApiProperty({ required: true, example: 'This is a comment' })
  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  @IsCleanHtml({
    message:
      'Allowed tags: <a>, <i>, <code>, <strong>. Allowed attributes: href, title.',
  })
  text: string;

  @ApiProperty({ required: false, example: 1 })
  @IsNumber()
  @IsOptional()
  parentCommentId: number;
}
