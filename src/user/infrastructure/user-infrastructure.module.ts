import { Module } from "@nestjs/common";
import { RedisPersistentStore } from "./redis";
import { HttpAxiosModule } from "./httpAxios";
import { SecurityTokenModule } from "./securityToken";
import { EmailInfrastructureModule } from "./email/emailInfrastructure.module";

@Module({
  imports: [RedisPersistentStore, HttpAxiosModule, SecurityTokenModule, EmailInfrastructureModule],
  exports: [RedisPersistentStore, HttpAxiosModule, SecurityTokenModule, EmailInfrastructureModule],
})
export class UserInfrastructureModule {}