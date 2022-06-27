import { Connection } from 'mongoose';
import { USERS, USER_REPOSITORY, VERIFIED_REPOSITORY, VERIFIED_USERS} from 'src/constants';
import { UserSchema } from './user.schema';
import { VerifiedUserSchema } from './verified.schema';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (connection: Connection) => connection.model(USERS, UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];

export const verifiedUsersProviders = [
  {
    provide: VERIFIED_REPOSITORY,
    useFactory: (connection: Connection) => connection.model(VERIFIED_USERS, VerifiedUserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];