import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ApiHttpResponse } from 'src/common/enums/api-http-response.enum';
import { PermissionRepositoryInterface } from 'src/components/permission/interface/permission.repository.interface';
import { DeleteResult } from 'typeorm';
import { CreateSubscriptionsDto } from '../dto/create-subscriptions.dto';
import { UpdateSubscriptionsDto } from '../dto/update-subscriptions.dto';
import { Subscription } from '../enitity/subscriptions.entity';
import { SubscriptionsRepositoryInterface } from '../interface/subscriptionss.repository.interface';
import { SubscriptionsServiceInterface } from '../interface/subscriptions.service.inaterface';

@Injectable()
export class SubscriptionsService implements SubscriptionsServiceInterface {
  private logger = new Logger(SubscriptionsService.name);

  constructor(
    @Inject('SubscriptionsRepositoryInterface')
    private readonly subscriptionRepository: SubscriptionsRepositoryInterface,
    @Inject('PermissionRepositoryInterface')
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}

  async create(data: CreateSubscriptionsDto): Promise<Subscription> {
    try {
      return await this.subscriptionRepository.create(data);
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findAll(): Promise<Subscription[]> {
    try {
      return await this.subscriptionRepository.findAll();
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOneById(id: string): Promise<Subscription> {
    try {
      const subscription =
        await this.subscriptionRepository.findByConditionsAndRelations({ id }, [
          'permissions',
        ]);

      if (!subscription) {
        throw new NotFoundException(
          `subscription ${ApiHttpResponse.NOT_FOUND}`,
        );
      }

      return subscription;
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async updata(
    id: string,
    data: UpdateSubscriptionsDto,
  ): Promise<Subscription> {
    try {
      let subscription = await this.subscriptionRepository.findOneById(id);

      if (!subscription) {
        throw new NotFoundException(
          `subscription ${ApiHttpResponse.NOT_FOUND}`,
        );
      }

      subscription = await this.subscriptionRepository.update(id, data);

      return subscription;
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async addPermission(
    subscriptionId: string,
    permissionId: string,
  ): Promise<void> {
    try {
      const subscription =
        await this.subscriptionRepository.findByIdAndRelations(subscriptionId, {
          relations: ['permissions'],
        });

      if (!subscription) {
        this.logger.error(`subscription #${subscriptionId} not found`);
        throw new NotFoundException(
          `subscription ${ApiHttpResponse.NOT_FOUND}`,
        );
      }

      const permission = await this.permissionRepository.findOneById(
        permissionId,
      );

      if (!permission) {
        this.logger.error(`permission #${permissionId} not found`);
        throw new NotFoundException(`permission ${ApiHttpResponse.NOT_FOUND}`);
      }

      subscription.permissions.push(permission);

      this.logger.log('adding permission');
      await subscription.save();
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err);
    }
  }

  async addPermissions(
    subscriptionId: string,
    permissionIds: string[],
  ): Promise<void> {
    const subscription = await this.subscriptionRepository.findByIdAndRelations(
      subscriptionId,
      {
        relations: ['permissions'],
      },
    );

    if (!subscription) {
      this.logger.error(`subscription #${subscriptionId} not found`);
      throw new NotFoundException(`subscription ${ApiHttpResponse.NOT_FOUND}`);
    }

    const permissions = [];

    permissionIds.forEach(async (permissionId) => {
      const permission = await this.permissionRepository.findOneById(
        permissionId,
      );

      if (!permission) {
        this.logger.error(`permission #${permissionId} not found`);
        throw new NotFoundException(`permission ${ApiHttpResponse.NOT_FOUND}`);
      }

      this.logger.debug('adding permission...');
      permissions.push(permission);
    });

    subscription.permissions = permissions;

    await subscription.save();
  }

  async removePermissions(
    subscriptionId: string,
    permissionIds: string[],
  ): Promise<Subscription> {
    const subscription =
      await this.subscriptionRepository.findByConditionsAndRelations(
        { id: subscriptionId },
        ['permissions'],
      );

    if (!subscription) {
      throw new NotFoundException(`subscription ${ApiHttpResponse.NOT_FOUND}`);
    }

    permissionIds.forEach(async (permissionId) => {
      const permissionIndex = subscription.permissions.findIndex(
        (perm) => perm.id === permissionId,
      );

      if (permissionIndex > -1) {
        subscription.permissions.splice(permissionIndex, 1);

        await subscription.save();
      }
    });

    return subscription;
  }

  async removePermission(
    subscriptionId: string,
    permission: string,
  ): Promise<Subscription> {
    try {
      const subscription =
        await this.subscriptionRepository.findByConditionsAndRelations(
          { id: subscriptionId },
          ['permissions'],
        );

      if (!subscription) {
        throw new NotFoundException(
          `subscription ${ApiHttpResponse.NOT_FOUND}`,
        );
      }

      const permissionIndex = subscription.permissions.findIndex(
        (perm) => perm.id === permission,
      );

      if (permissionIndex > -1) {
        subscription.permissions.splice(permissionIndex, 1);

        await subscription.save();
      }

      return subscription;
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    try {
      const subscription = await this.subscriptionRepository.findOneById(id);

      if (!subscription) {
        throw new NotFoundException(
          `subscription ${ApiHttpResponse.NOT_FOUND}`,
        );
      }

      return this.subscriptionRepository.remove(id);
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
