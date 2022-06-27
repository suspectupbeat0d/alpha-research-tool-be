import { Module } from '@nestjs/common';
import { usersProviders, verifiedUsersProviders } from '../user/user.provider';
import { databaseProviders } from './database.provider';

@Module({
  providers: [
    ...databaseProviders,
    ...usersProviders,
    ...verifiedUsersProviders,
  ],
  exports: [
    ...databaseProviders,
    ...usersProviders,
    ...verifiedUsersProviders,
  ],
})
export class DatabaseModule {}
