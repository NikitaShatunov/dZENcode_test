import { AbstractEntityClass } from 'src/database/AbstractEntityClass';
import { Media } from 'src/media/entities/media.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Comment extends AbstractEntityClass<Comment> {
  @Column({ nullable: false })
  text: string;

  @ManyToOne(() => Comment, (comment) => comment.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];

  @Column({ default: 0 })
  childrenCount: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  user: User;

  @OneToOne(() => Media, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mediaId' })
  media: Media;

  @Column({ nullable: false })
  userName: string;

  @Column({ nullable: false })
  userEmail: string;

  @Column({ nullable: true })
  homePageUrl: string;
}
