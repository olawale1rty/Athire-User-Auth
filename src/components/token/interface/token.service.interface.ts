import { User } from 'src/components/user/entity/user.entity';
import { DeleteResult } from 'typeorm';
import { CreateTokenDto } from '../dto/create-token.dto';
import { Token } from '../entity/token.entity';

export interface TokenServiceInterface {
  create(payload: CreateTokenDto): Promise<Token>;

  findAll(): Promise<Array<Token>>;

  findOne(id: string): Promise<Token>;

  update(id: string, payload: any): Promise<Token>;

  findByUser(user: User): Promise<Array<Token>>;

  remove(id: string): Promise<DeleteResult>;
}
