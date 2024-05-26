import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ApiHttpResponse } from 'src/common/enums/api-http-response.enum';
import { DeleteResult, In } from 'typeorm';
import { UserCreateDto } from 'src/components/auth/dto/user-create.dto';
import { Token } from 'src/components/token/entity/token.entity';
import { ChangeRoleDto } from '../dto/change-role.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserRole } from '../entity/user-role.entity';
import { User } from '../entity/user.entity';
import { UserRoleRepositoryInterface } from '../interface/user-role.repository.interface';
import { UserRepositoryInterface } from '../interface/user.repository.interface';
import { UserServiceInterface } from '../interface/user.service.interface';
import { TokenServiceInterface } from 'src/components/token/interface/token.service.interface';
import { Subscription } from 'src/components/subscriptions/enitity/subscriptions.entity';
import { SubscriptionsRepositoryInterface } from 'src/components/subscriptions/interface/subscriptionss.repository.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { genSaltSync, hash } from 'bcryptjs';
import axios from 'axios';
import { Roles } from 'src/common/enums/roles.enum';

@Injectable()
export class UserService implements UserServiceInterface {
  private logger = new Logger(UserService.name);
  private firebaseRestBaseUrl = process.env.FIREBASE_WEB_BASE_URL;
  private firebaseWebToken = process.env.FIREBASE_WEB_API_KEY;

  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepo: UserRepositoryInterface,
    @Inject('UserRoleRepositoryInterface')
    private readonly userRoleRepo: UserRoleRepositoryInterface,
    // private readonly sendGrid: SendGridService,
    @Inject('TokenServiceInterface')
    private readonly tokenService: TokenServiceInterface,
    @Inject('SubscriptionsRepositoryInterface')
    private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
  ) {}

  public async create(userDto: UserCreateDto, isAdmin: boolean): Promise<User> {
    // try {
    const isEmailTaken = await this.userRepo.findByConditionsAndRelations(
      {
        email: userDto.email,
      },
      ['role'],
    );

    if (isEmailTaken) {
      this.logger.error('Email already taken');
      throw new BadRequestException(ApiHttpResponse.EMAIL_TAKEN);
    }

    const role = new UserRole();
    const subscription = new Subscription();

    await this.subscriptionsRepository.create(subscription);

    role.subscription = subscription;

    await this.userRoleRepo.create(role);

    const user = new User();
    user.firstName = userDto.firstName;
    user.lastName = userDto.lastName;
    user.phone = userDto.phone;
    user.email = userDto.email;
    user.role = role;
    user.password = userDto.password;
    if (isAdmin) {
      user.isVerified = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newUser = await this.userRepo.create(user);

    if (newUser !== undefined) {
      // subscribe user to airsmat free plan
      await axios.get(`${process.env.SUBSCRIPTION_SERVICE_BASE_URL}/plans/name/Free%20Plan`)
      .then(async (response) => {
        await axios.post(`${process.env.SUBSCRIPTION_SERVICE_BASE_URL}/plans/${response.data.planCode}/subscribe`, {
          "userId": newUser.id,
          "firstName": newUser.firstName,
          "lastName": newUser.lastName,
          "email": newUser.email,
        })
        .then((response) => console.info("Free Plan subscription successful."))
        .catch((error) => console.error('error subscribing to free plan'));
      }).catch((error) => console.error('error getting plan by name'));

      // signup user to firebase
      await this.createFirebaseUser(userDto);
    }

    return newUser;
    // } catch (error) {
    //   this.logger.error('Error creating user >> ', error.message);
    //   console.log(error);
    // }
  }

  async verifyUser(userId: string, isVerified: boolean): Promise<void> {
    const user = await this.userRepo.findOneById(userId);

    if (!user) {
      this.logger.error('user not found');
      throw new NotFoundException(`user ${ApiHttpResponse.NOT_FOUND}`);
    }

    user.isVerified = isVerified;

    user.save();
  }

  public async getUser(userId: string): Promise<User> {
    try {
      const user = await this.userRepo.findByConditionsAndRelations(
        {
          id: userId,
        },
        ['role', 'role.subscription', 'role.subscription.permissions'],
      );

      console.log(user);

      if (!user) {
        throw new NotFoundException(`user ${ApiHttpResponse.NOT_FOUND}`);
      }

      // Get user's permissions from subscription service
      await axios.get(`${process.env.SUBSCRIPTION_SERVICE_BASE_URL}/subscribers/${user.id}/subscriptions/permissions`)
      .then((response) => {
        console.info("Get user permissions was successful");
        user.role.subscription.permissions = response.data.permissions;
      })
      .catch((error) => console.error('=== ERROR GETTING USER PERMISSIONS ==='));

      return user;
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  getUsersByIds(userids: string[]): Promise<Array<User>> {
    return this.userRepo.findAllByConditions({ id: In(userids) });
  }

  async getUserByEmail(email: string): Promise<User> {
    console.log(email);
    const user = await this.userRepo.findByConditionsAndRelations({
      email: email,
    },['role', 'role.subscription', 'role.subscription.permissions'],);

    console.log(user);

    if (!user) {
      throw new NotFoundException(`user ${ApiHttpResponse.NOT_FOUND}`);
    }

    return user;
  }

  async getUsers(): Promise<User[]> {
    try {
      return await this.userRepo.findAllByRelations({
        relations: [
          'role',
          'role.subscription',
          'role.subscription.permissions',
        ],
      });
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(id: string, user: UserUpdateDto): Promise<User> {
    try {
      if (user.password != null) {
        user.password = await hash(user.password, genSaltSync(10));
      }
      return await this.userRepo.update(id, user);
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async getUserTokens(id: string): Promise<Array<Token>> {
    try {
      const user = await this.userRepo.findOneById(id);

      if (!user) {
        throw new NotFoundException(`user ${ApiHttpResponse.NOT_FOUND}`);
      }

      return this.tokenService.findByUser(user);
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  paginate(page: number, limit: number): Observable<Pagination<User>> {
    try {
      this.logger.log(
        'Featching all missions from database and serve to client',
      );

      return this.userRepo.paginateWithRelation(
        { page, limit },
        { relations: ['role'] },
      );
    } catch (err) {
      this.logger.error('Internal server error >> ', err);
      throw new InternalServerErrorException(err.name);
    }
  }

  async findByRole(role: string): Promise<User[]> {
    try {
      const users = await this.userRepo.findAllByRelations({
        relations: [
          'role',
          'role.subscription',
          'role.subscription.permissions',
        ],
      });

      return users.filter((user) => user.role.role === role);
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  paginateRole(
    page: number,
    limit: number,
    roleid: string,
  ): Observable<Pagination<User>> {
    try {
      this.logger.log(
        'Featching all missions from database and serve to client',
      );

      return this.userRepo.paginateWithRelation(
        { page, limit },
        {
          relations: ['role'],
          where: [{ 'role.role': 'user' }],
        },
      );
    } catch (err) {
      this.logger.error('Internal server error >> ', err);
      throw new InternalServerErrorException(err.name);
    }
  }

  async changeUserRole(id: string, role: ChangeRoleDto): Promise<UserRole> {
    try {
      const user = await this.userRepo.findByConditionsAndRelations(
        {
          id: id,
        },
        ['role'],
      );

      if (!user) {
        throw new NotFoundException(`user ${ApiHttpResponse.NOT_FOUND}`);
      }

      let userRole = await this.userRoleRepo.findOneById(user.role.id);

      if (!userRole) {
        throw new NotFoundException(`User role ${ApiHttpResponse.NOT_FOUND}`);
      }

      userRole = await this.userRoleRepo.update(userRole.id, {
        role: role.role,
      });

      return userRole;
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async changeUserToAgent(id: string, role: Roles): Promise<UserRole> {
    try {
      const user = await this.userRepo.findByConditionsAndRelations(
        {
          id: id,
        },
        ['role'],
      );

      if (!user) {
        throw new NotFoundException(`user ${ApiHttpResponse.NOT_FOUND}`);
      }

      let userRole = await this.userRoleRepo.findOneById(user.role.id);

      if (!userRole) {
        throw new NotFoundException(`User role ${ApiHttpResponse.NOT_FOUND}`);
      }

      userRole = await this.userRoleRepo.update(userRole.id, {
        role: role,
      });

      return userRole;
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepo.findOneInLowercase('users',{
      email: email,
    });

    if (!user) {
      throw new BadRequestException(ApiHttpResponse.BAD_REQUEST);
    }

    const validPassword = user.compare(currentPassword);

    if (!validPassword) {
      throw new BadRequestException(ApiHttpResponse.BAD_REQUEST, "Password incorrect");
    }

    await this.userRepo.update(user.id, {
      password: await hash(newPassword, genSaltSync(10)),
    });
  }

  /* async addRole(userId: string, subscriptionIds: string): Promise<User> {
    try {
      const user = await this.userRepo.findByConditionsAndRelations(
        {
          id: userId,
        },
        ['role'],
      );

      if (!user) {
        throw new NotFoundException(`user ${ApiHttpResponse.NOT_FOUND}`);
      }

      const userRole = await this.userRoleRepo.findByIdAndRelations(
        user.role.id,
        { relations: ['subscription'] },
      );

      if (!userRole) {
        throw new NotFoundException(`User role ${ApiHttpResponse.NOT_FOUND}`);
      }

      const sub = await this.subscriptionsService.findOneById(subscriptionIds);

      if (!sub) {
        this.logger.error('Subscription not found');
        throw new NotFoundException(
          `Subscription ${ApiHttpResponse.NOT_FOUND}`,
        );
      }

      await this.userRoleRepo.update(userRole.id, {
        subscription: sub,
      });

      return user;
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  } */

  /* async removeRole(userId: string, roleId: string): Promise<User> {
    try {
      const user = await this.userRepo.findByConditionsAndRelations(
        {
          id: userId,
        },
        ['role'],
      );

      if (!user) {
        throw new NotFoundException(`user ${ApiHttpResponse.NOT_FOUND}`);
      }

      const userRole = await this.userRoleRepo.findByConditionsAndRelations(
        {
          id: user.role.id,
        },
        ['roles'],
      );

      if (!userRole) {
        throw new NotFoundException(`User role ${ApiHttpResponse.NOT_FOUND}`);
      }

      const role = await this.roleService.findOneById(roleId);

      if (!role) {
        throw new NotFoundException(`Role ${ApiHttpResponse.NOT_FOUND}`);
      }

      const roleIndex = userRole.roles.findIndex((role) => role.id === roleId);

      if (roleIndex > -1) {
        const roles = userRole.roles.splice(roleIndex, 1);

        console.log(roles);

        await this.userRoleRepo.update(userRole.id, { roles: roles });
      }

      return this.userRepo.findByConditionsAndRelations(
        {
          id: userId,
        },
        ['role', 'role.roles'],
      );
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  } */

  public async deleteUser(userId: string): Promise<DeleteResult> {
    try {
      return await this.userRepo.remove(userId);
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  // create firebase urser
  public async createFirebaseUser(user: UserCreateDto): Promise<void>{
    await axios.post(`${this.firebaseRestBaseUrl}:signUp?key=${this.firebaseWebToken}`, {
      email: user.email,
      password: user.password,
      returnSecureToken: false,
    }).then(async (res) => {
      await axios.post(`${this.firebaseRestBaseUrl}:update?key=${this.firebaseWebToken}`, {
        idToken: res.data.idToken,
        displayName: `${user.firstName} ${user.lastName}`.trim(),
        returnSecureToken: false,
      }).catch((error => this.logger.error('update firebase user displayname error: ', error)));
    }).catch((error) => this.logger.error('Error creating firebase user acctount: ', error));
  }
}
