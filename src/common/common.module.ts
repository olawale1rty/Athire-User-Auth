import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RolesGuard } from './guard/roles.guard';

@Module({
  imports: [ConfigModule],
  providers: [RolesGuard],
})
export class CommonModule {}
