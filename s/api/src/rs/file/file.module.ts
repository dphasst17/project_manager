import {Module} from "@nestjs/common";
import { FileController } from "./file.controller";
import { NatsClientModule } from "src/nats-client/nats-client.module";
@Module({
  controllers: [FileController],
  providers: [],
  imports: [NatsClientModule]
})

export class FileModule {}

