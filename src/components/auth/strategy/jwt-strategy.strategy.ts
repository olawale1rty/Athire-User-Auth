import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepositoryInterface } from 'src/components/user/interface/user.repository.interface';
import { RedisServiceInterface } from 'src/redis/interface/redis.service.interface';
import { AuthServiceInterface } from '../interface/auth-service.interface';

@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepo: UserRepositoryInterface,
    @Inject('RedisServiceInterface')
    private readonly redisService: RedisServiceInterface,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const { email } = payload;
    console.log(email);
    const user = await this.userRepo.findByConditionsAndRelations({ email }, [
      'role',
      'role.subscription',
      'role.subscription.permissions',
    ]);

    // Get user's permissions from subscription service
    await axios.get(`${process.env.SUBSCRIPTION_SERVICE_BASE_URL}/subscribers/${user.id}/subscriptions/permissions`)
    .then((response) => {
      console.info("=== GET AND SAVE USER'S PERMISSIONS TO CACHE ===");
      user.role.subscription.permissions = response.data.permissions;
    })
    .catch((error) => console.error('error subscribing to free plan'));


    // Cache user data in redis
    // await this.redisService.del(email);
    // console.log(user.role.subscription.permissions[0].name);
    console.info("=== NUMBER OF USER'S PERMISSIONS: " + user.role.subscription.permissions.length + "  ===");
    await this.redisService.set(email, { user });

    if (!user || user.isVerified === false) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
