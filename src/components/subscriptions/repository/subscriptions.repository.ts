import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/common/repositories/base/base.abstract.repository';
import { Repository } from 'typeorm';
import { Subscription } from '../enitity/subscriptions.entity';

export class SubscriptionsRepositoryImpl extends BaseAbstractRepository<Subscription> {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {
    super(subscriptionRepository);
  }
}
