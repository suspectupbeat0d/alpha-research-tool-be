import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  PROJECT_REPOSITORY,
} from 'src/constants';
import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { IProjectDocument } from './project.schema';

@Injectable()
export class ProjectService extends sharedCrudService {
  constructor(
    @Inject(PROJECT_REPOSITORY) readonly projectRepo: Model<IProjectDocument>,
  ) {
    super(projectRepo);
  }
}
