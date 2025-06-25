import {Module} from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { NatsClientModule } from "src/nats-client/nats-client.module";
@Module({
  controllers: [ChatController],
  providers: [],
  imports: [NatsClientModule]
})

export class ChatModule {}

