import * as mongoose from 'mongoose';
import { env } from 'process';
console.log(env.DATABASE_URL,"env.DATABASE_URL");

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>{ 
      return mongoose.connect(
        "mongodb://adminart:burkan123@194.163.142.38:30000/?directConnection=true&authSource=admin&appName=mongosh+1.5.4"
        // "mongodb+srv://alpharesearchtools:Burkan123@alpharesearchtools.hzt73.mongodb.net/art?retryWrites=true&w=majority"
      )}
  },
];