import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  USER_REPOSITORY,
} from 'src/constants';
import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { IUserDocument } from './user.schema';

@Injectable()
export class UserService extends sharedCrudService {
  constructor(
    @Inject(USER_REPOSITORY) readonly userRepository: Model<IUserDocument>,
  ) {
    super(userRepository);
  }
}
