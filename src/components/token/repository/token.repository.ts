import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/components/token/entity/token.entity';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from '../../../common/repositories/base/base.abstract.repository';

export class TokenRepositoryImpli extends BaseAbstractRepository<Token> {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {
    super(tokenRepository);
  }
}
