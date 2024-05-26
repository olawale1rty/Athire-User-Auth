import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ApiHttpResponse } from 'src/common/enums/api-http-response.enum';
import { User } from 'src/components/user/entity/user.entity';
import { DeleteResult } from 'typeorm';
import { CreateTokenDto } from '../dto/create-token.dto';
import { Token } from '../entity/token.entity';
import { TokenRepositoryInterface } from '../interface/token.repository.interface';
import { TokenServiceInterface } from '../interface/token.service.interface';

@Injectable()
export class TokenService implements TokenServiceInterface {
  constructor(
    @Inject('TokenRepositoryInterface')
    private readonly tokenRepository: TokenRepositoryInterface,
  ) {}

  create(payload: CreateTokenDto): Promise<Token> {
    return this.tokenRepository.create(payload);
  }

  async findAll(): Promise<Token[]> {
    return await this.tokenRepository.findAll();
  }

  async findOne(id: string): Promise<Token> {
    const token = await this.tokenRepository.findOneById(id);

    if (!token) {
      throw new NotFoundException(`Token #${id} ${ApiHttpResponse.NOT_FOUND}`);
    }

    return token;
  }

  async findByUser(user: User): Promise<Token[]> {
    return await this.tokenRepository.findAllByConditions({ user });
  }

  async update(id: string, payload: any): Promise<Token> {
    return await this.tokenRepository.update(id, payload);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.tokenRepository.remove(id);
  }
}
