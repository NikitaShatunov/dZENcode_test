import { AbstractEntityClass } from 'src/database/AbstractEntityClass';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  user: User;
}
