import * as mongoose from 'mongoose';
import { env } from 'process';
console.log(env.DATABASE_URL,"env.DATABASE_URL");

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>{ 
      return mongoose.connect(
        "mongodb+srv://alpharesearchtools:Burkan123@alpharesearchtools.hzt73.mongodb.net/art?retryWrites=true&w=majority"
      )}
  },
];
