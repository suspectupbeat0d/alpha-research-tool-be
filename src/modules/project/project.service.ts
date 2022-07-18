import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  PROJECT_REPOSITORY,
} from 'src/constants';
import { EProjectType } from 'src/enums/project.enums';
import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { IProjectDocument } from './project.schema';

@Injectable()
export class ProjectService extends sharedCrudService {
  constructor(
    @Inject(PROJECT_REPOSITORY) readonly projectRepo: Model<IProjectDocument>,
  ) {
    super(projectRepo);
  }

  async getAllProjects(
    page: number,
    resPerPage: number,
    search: string,
    minEbcount: number,
    maxEbcount: number,
    minFollowers: number,
    maxFollowers: number
  ) {
    console.log(minFollowers, "minFollowers")
    console.log(maxFollowers, "maxFollowers")
    const query = [];
    const sorting = [];
    let sort = {};
    sort['createdAt'] = -1;
    sorting.push({ createdAt: -1 });
    query.push({status: EProjectType.ACTIVE})

    if (minEbcount > 0) query.push({ ebCount: { $gte: minEbcount } });
    if (maxEbcount > 0) query.push({ ebCount: { $lte: maxEbcount } });
    if(minEbcount > 0 && maxEbcount > 0) query.push({$and: [{ ebCount: { $gte: minEbcount } }, { ebCount: { $lte: maxEbcount } }]})

    if (minFollowers > 0) query.push({ followers: { $gte: minFollowers } });
    if (maxFollowers > 0) query.push({ followers: { $lte: maxFollowers } });
    if(minFollowers > 0 && maxFollowers > 0) query.push({$and: [{ followers: { $gte: minFollowers } }, { followers: { $lte: maxFollowers } }]})


    // if (ranking) {
    //   ranking === FEATURED
    //     ? query.push({ featured: true })
    //     : ranking === TOP
    //     ? (sort['buyers.length'] = -1)
    //     : ranking === 'latest'
    //     ? query.push({})
    //     : null;
    // }
    
    if (search) query.push({$or: [{ name: { $regex: search, $options: 'i' } }, { title: { $regex: search, $options: 'i' } }]});

    const [projects, projectsCount]: any = await Promise.all([
      this.projectRepo
        .find({ $and: [...query] })
        .sort(sort)
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage),
      this.projectRepo.find({ $and: [...query] }).count(),
    ]);

    const projectsResp = {
      projects: projects,
      current_page: page,
      pages: Math.ceil(projectsCount / resPerPage),
      total_projects: projectsCount,
      per_page: resPerPage,
    };

    return projectsResp;
  }

}
