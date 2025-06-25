import {  MiddlewareConsumer, RequestMethod, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './rs/auth/auth.module';
import { ProjectModule } from './rs/project/project.module';
import { EmployeesModule } from './rs/employees/employees.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Middleware } from './middleware/middle';
import { AdminMiddleware } from './middleware/adminMiddle';
import { JwtModule } from '@nestjs/jwt';
import {ChatModule} from './rs/chat/chat.module';
import {FileModule} from './rs/file/file.module';
import {ChatGateway} from './rs/socket/chat.gateway';

@Module({
  imports:[
    ConfigModule.forRoot({}),
    JwtModule.register({ global: true, secret: process.env.SJ as string }),
    AuthModule,ProjectModule,EmployeesModule,ChatModule,FileModule
  ],
  controllers: [AppController],
  providers: [AppService,ChatGateway],
})
export class AppModule {
  configure(
    consumer: MiddlewareConsumer
  ) {
    consumer
      .apply(Middleware)
      .forRoutes(
        { path: 'api/auth/update', method: RequestMethod.PATCH },
        { path: '/api/employees/info', method: RequestMethod.POST },
        { path: '/api/project/task/employee',method: RequestMethod.GET },
        { path: '/api/project/task/employee/status',method: RequestMethod.GET },
        { path: '/api/project/employee',method: RequestMethod.POST },
        { path: '/api/project/task/:id',method: RequestMethod.PATCH },
        { path: 'api/chat/employee', method: RequestMethod.GET },
        { path: 'api/chat', method: RequestMethod.POST },
      );
    consumer
      .apply(AdminMiddleware)
      .forRoutes(
        { path: 'api/auth/signup', method: RequestMethod.POST },

        { path: 'api/employees', method: RequestMethod.POST },
        { path: 'api/employees/detail/:id', method: RequestMethod.GET },
        { path: 'api/employees/:id', method: RequestMethod.PATCH },
        { path: 'api/employees/team/:id', method: RequestMethod.PATCH },
        { path: 'api/employees/team', method: RequestMethod.POST },
        { path: 'api/employees/team/member', method: RequestMethod.POST },
        { path: 'api/employees/team', method: RequestMethod.GET},
        { path: 'api/employees/team/member/:id', method: RequestMethod.GET },
        
        { path: 'api/project/task', method: RequestMethod.GET },
        { path: 'api/project/task/status', method: RequestMethod.GET },
        { path: 'api/project', method: RequestMethod.GET },
        { path: 'api/project', method: RequestMethod.POST },
        { path: 'api/project/append', method: RequestMethod.POST },

        { path: 'api/chat/admin', method: RequestMethod.GET },
        { path: 'api/chat/channel', method: RequestMethod.POST },
        { path: 'api/chat/channel', method: RequestMethod.PATCH },
    );
  }
}
