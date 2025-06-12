import { Module } from '@nestjs/common';
import { RsController } from './rs.controller';
import { RsService } from './rs.service';
import { NatsClientModule } from '../nats/nats.client.module';
import { RsRepo } from './rs.repo';
import { KyselyModule } from 'nestjs-kysely';
import {MysqlDialect} from 'kysely';
import { createPool } from 'mysql2'

@Module({
  imports: [
    NatsClientModule,
    KyselyModule.forRoot({
      dialect: new MysqlDialect({
        pool: createPool({
          host: process.env.HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          port: Number(process.env.PORT_SQL),
        })
      })
    })
  ],
  controllers: [RsController],
  providers: [RsService,RsRepo],
})
export class RsModule {}
