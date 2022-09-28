import * as mongoose from 'mongoose';
import { env } from 'process';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>{ 
      return mongoose.connect(
        env.DATABASE_URL
      )}
  },
];
