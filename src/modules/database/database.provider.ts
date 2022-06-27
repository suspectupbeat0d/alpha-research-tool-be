import * as mongoose from 'mongoose';
import { env } from 'process';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
          "mongodb+srv://rehmanwahlah:0GFWk4aXP8VGnUph@cluster0.charr.mongodb.net/art?retryWrites=true"  
      ),
  },
];
