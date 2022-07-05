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
    title: string,
    price: number,
  ) {

    const query = [];
    const sorting = [];
    let sort = {};
    sort['createdAt'] = -1;
    sorting.push({ createdAt: -1 });
    query.push({status: EProjectType.ACTIVE})
    // if (price > 0) query.push({ price: { $lte: price } });

    // if (ranking) {
    //   ranking === FEATURED
    //     ? query.push({ featured: true })
    //     : ranking === TOP
    //     ? (sort['buyers.length'] = -1)
    //     : ranking === 'latest'
    //     ? query.push({})
    //     : null;
    // }
    
    if (title) query.push({ title: { $regex: title, $options: 'i' } });

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
