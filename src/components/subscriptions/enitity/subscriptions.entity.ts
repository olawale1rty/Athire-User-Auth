import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { Abstract } from 'src/common/entity/abstract.entity';
import { Permission } from 'src/components/permission/enitity/permission.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

export class Expiration {
  @Column({ type: 'date', nullable: true })
  @ApiProperty({
    name: 'smatStar',
    description: 'smatSTAR subscription expiration',
    required: false,
  })
  @IsOptional()
  @IsDate()
  smatStar: Date;

  @ApiProperty({
    name: 'smatMapper',
    description: 'SmatMapper subscription expiration',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Column({ type: 'date', nullable: true })
  smatMapper: Date;

  @ApiProperty({
    name: 'smatAi',
    description: 'smatAi subscription expiration',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Column({ type: 'date', nullable: true })
  smatAi: Date;

  @ApiProperty({
    name: 'smatSat',
    description: 'smatSat subscription expiration',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Column({ type: 'date', nullable: true })
  smatSat: Date;
}

@Entity('subscriptions')
export class Subscription extends Abstract {
  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];

  @Column(() => Expiration)
  expirationDate: Expiration;
}
