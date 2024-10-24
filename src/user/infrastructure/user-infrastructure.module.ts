import { Module } from "@nestjs/common";
import { RedisPersistentStore } from "./redis";

@Module({
  imports: [RedisPersistentStore],
  controllers: [],
  providers: [],
  exports: [],
})
export class UserInfrastructureModule {}