import { Module } from "@nestjs/common";
import { RedisPersistentStore } from "./redis";
import { HttpAxiosModule } from "./httpAxios";

@Module({
  imports: [RedisPersistentStore, HttpAxiosModule],
  exports: [RedisPersistentStore, HttpAxiosModule],
})
export class UserInfrastructureModule {}