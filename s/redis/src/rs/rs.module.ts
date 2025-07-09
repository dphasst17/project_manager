import { Module } from '@nestjs/common';
import { RsController } from './rs.controller';
import { RsService } from './rs.service';
import { NatsClientModule } from '../nats/nats.client.module';
import { RsRepo } from './rs.repo';
import { RedisMeetingService } from './public_meeting.service';
@Module({
  imports: [NatsClientModule],
  controllers: [RsController],
  providers: [RsService,RedisMeetingService,RsRepo],
})
export class RsModule {}
