import { Module } from '@nestjs/common';
import { projectProviders } from '../project/project.provider';
import { usersProviders, verifiedUsersProviders } from '../user/user.provider';
import { databaseProviders } from './database.provider';

@Module({
  providers: [
    ...usersProviders,
    ...projectProviders,
    ...databaseProviders,
    ...verifiedUsersProviders,
  ],
  exports: [
    ...usersProviders,
    ...projectProviders,
    ...databaseProviders,
    ...verifiedUsersProviders,
  ],
})
export class DatabaseModule {}
