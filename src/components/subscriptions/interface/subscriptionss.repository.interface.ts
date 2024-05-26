import { BaseInterfaceRepository } from 'src/common/repositories/base/base.interface.repository';
import { Subscription } from '../enitity/subscriptions.entity';

export type SubscriptionsRepositoryInterface =
  BaseInterfaceRepository<Subscription>;
