import { Module } from '@nestjs/common';
import { RsModule } from './rs/rs.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
