import { Module } from '@nestjs/common';
import { RsController } from './rs.controller';
import { RsService } from './rs.service';
import { NatsClientModule } from '../nats/nats.client.module';
import { RsRepo } from './rs.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema, ImagesSchema } from '../schemas/chat.schema';
import { ChannelSchema } from '../schemas/channel.schema';
@Module({
  imports: [
    NatsClientModule,
    MongooseModule.forFeature([{ name: 'chat', schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: 'channel', schema: ChannelSchema }]),
    MongooseModule.forFeature([{ name: 'images', schema: ImagesSchema }]),
  ],
  controllers: [RsController],
  providers: [RsService, RsRepo],
})
export class RsModule {}
