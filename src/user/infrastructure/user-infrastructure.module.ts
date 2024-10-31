import { Module } from "@nestjs/common";
import { RedisPersistentStore } from "./redis";
import { HttpAxiosModule } from "./httpAxios";
import { SecurityTokenModule } from "./securityToken";

@Module({
  imports: [RedisPersistentStore, HttpAxiosModule, SecurityTokenModule],
  exports: [RedisPersistentStore, HttpAxiosModule, SecurityTokenModule],
})
export class UserInfrastructureModule {}