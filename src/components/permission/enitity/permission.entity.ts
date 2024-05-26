import { Abstract } from 'src/common/entity/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('permissions')
export class Permission extends Abstract {
  @Column()
  name: string;

  constructor(partial: Partial<Permission>) {
    super();
    Object.assign(this, partial);
  }
}
