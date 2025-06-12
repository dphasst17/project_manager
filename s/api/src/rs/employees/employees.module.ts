import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
@Module({
  controllers:[EmployeesController],
  providers:[],
  imports:[NatsClientModule]
})
export class EmployeesModule {}
