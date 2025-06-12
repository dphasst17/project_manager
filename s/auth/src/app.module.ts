import { Module } from '@nestjs/common';
import { RsModule } from './rs/rs.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({ global: true, secret: process.env.SJ as string }),
    RsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
