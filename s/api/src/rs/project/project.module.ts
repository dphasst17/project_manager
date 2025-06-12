import {Module} from "@nestjs/common";
import {ProjectController} from "./project.controller";
import {NatsClientModule} from "src/nats-client/nats-client.module";
@Module({
  imports: [
    NatsClientModule
  ],
  controllers: [
    ProjectController
  ],
  providers: []
})
export class ProjectModule {}
