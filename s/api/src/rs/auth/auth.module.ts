import {Module} from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { NatsClientModule } from "src/nats-client/nats-client.module";
@Module({
  controllers: [AuthController],
  providers: [],
  imports: [NatsClientModule]
})

export class AuthModule {}
