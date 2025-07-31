import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
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

  @ApiProperty({ required: true, example: 'John Doe' })
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ required: true, example: 'john.doe@example.com' })
  @IsEmail()
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty({ required: false, example: 'https://example.com' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  homePageUrl: string;
}
