import { Connection } from 'mongoose';
import { PROJECTS, PROJECT_REPOSITORY } from 'src/constants';
import { ProjectSchema } from './project.schema';

export const projectProviders = [
  {
    provide: PROJECT_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.model(PROJECTS, ProjectSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
