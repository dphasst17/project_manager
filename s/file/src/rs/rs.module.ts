import { Module } from '@nestjs/common';
import { RsController } from './rs.controller';
import { RsService } from './rs.service';
import { ImageService } from './images.service';
import { NatsClientModule } from '../nats/nats.client.module';
import { RsRepo } from './rs.repo';
@Module({
  imports: [NatsClientModule],
  controllers: [RsController],
  providers: [ImageService,RsService,RsRepo],
})
export class RsModule {}
