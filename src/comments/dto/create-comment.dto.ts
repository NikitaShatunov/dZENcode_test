import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  text: string;

  parentCommentId: number;
}
