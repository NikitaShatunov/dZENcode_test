import { AbstractEntityClass } from 'src/database/AbstractEntityClass';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity()
export class Media extends AbstractEntityClass<Media> {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, default: true })
  is_public: boolean;

  @Column({ nullable: false })
  path: string;
}
