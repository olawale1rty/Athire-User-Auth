import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Roles } from 'src/common/enums/roles.enum';
import { Abstract } from 'src/common/entity/abstract.entity';
import { Subscription } from 'src/components/subscriptions/enitity/subscriptions.entity';

@Entity('user_roles')
export class UserRole extends Abstract {
  @OneToOne(() => Subscription)
  @JoinColumn({ name: 'subscriptions' })
  subscription: Subscription;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
    name: 'user_role',
  })
  role: Roles;

  /* @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
    primary: true,
  })
  user: User; */
}
