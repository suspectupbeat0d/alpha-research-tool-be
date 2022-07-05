import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  USER_REPOSITORY,
} from 'src/constants';
import { EAdminType } from 'src/enums/admin.enums';
import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { IUserDocument } from '../user/user.schema';

@Injectable()
export class AdminService extends sharedCrudService {
  constructor(
    @Inject(USER_REPOSITORY)
    readonly userRepo: Model<IUserDocument>,
  ) {
    super(userRepo);
  }

  /**
   * Get all users
   * @param userId
   * @returns
   */
  async getAllUsers(page: number, resPerPage: number, search): Promise<any> {
    const query = [];
    query.push({
      roles: {
        $nin: EAdminType.ADMIN,
      }
    })

    if (search) query.push({$or:[{name: { $regex: search, $options: 'i' }},{username: { $regex: search, $options: 'i' }}, {email: { $regex: search, $options: 'i' }}]});
    
    const [users, usersCount] = await Promise.all([
      this.userRepo
        .find({ $and: [...query] })
        .sort({ createdAt: -1 })
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage),

      // @ts-ignore
      this.userRepo
        .find({
          roles: {
            $nin: EAdminType.ADMIN,
          },
        })
        .count(),
    ]);

    return {
      users: users,
      current_page: page,
      pages: Math.ceil(usersCount / resPerPage),
      total_users: usersCount,
      per_page: resPerPage,
    };
  }

  async blockUser(userId: string) {
    return await this.userRepo.findByIdAndUpdate(userId, { isActive: false });
  }

  async unBlockUser(userId: string) {
    return await this.userRepo.findByIdAndUpdate(userId, { isActive: true });
  }

}
