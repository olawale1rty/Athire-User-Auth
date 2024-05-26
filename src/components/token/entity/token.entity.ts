import { Abstract } from 'src/common/entity/abstract.entity';
import { TokenType } from 'src/common/enums/token-type.enum';
import { User } from 'src/components/user/entity/user.entity';
import { ManyToOne, Column, Entity } from 'typeorm';

@Entity('tokens')
export class Token extends Abstract {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  token!: string;

  @Column({
    enum: TokenType,
    nullable: true,
    type: 'enum',
  })
  type!: TokenType;

  @Column()
  validTo!: Date;
}
