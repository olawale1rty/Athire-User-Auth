import { DeleteResult } from 'typeorm';
import { CreateSubscriptionsDto } from '../dto/create-subscriptions.dto';
import { UpdateSubscriptionsDto } from '../dto/update-subscriptions.dto';
import { Subscription } from '../enitity/subscriptions.entity';

export interface SubscriptionsServiceInterface {
  create(data: CreateSubscriptionsDto): Promise<Subscription>;

  findAll(): Promise<Subscription[]>;

  findOneById(id: string): Promise<Subscription>;

  updata(id: string, data: UpdateSubscriptionsDto): Promise<Subscription>;

  addPermission(subscriptionId: string, permissionId: string): Promise<void>;

  addPermissions(
    subscriptionId: string,
    permissionIds: string[],
  ): Promise<void>;

  removePermissions(
    subscriptionId: string,
    permissionIds: string[],
  ): Promise<Subscription>;

  removePermission(
    subscriptionId: string,
    permissions: string,
  ): Promise<Subscription>;

  delete(id: string): Promise<DeleteResult>;
}
