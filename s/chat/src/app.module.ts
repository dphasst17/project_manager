import { Module } from '@nestjs/common';
import { RsModule } from './rs/rs.module';
import { ConfigModule } from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';

@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    RsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
